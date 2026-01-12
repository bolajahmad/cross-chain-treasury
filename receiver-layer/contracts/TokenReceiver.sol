// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@hyperbridge/core/contracts/libraries/StateMachine.sol";
import "@hyperbridge/core/contracts/interfaces/IDispatcher.sol";
import {HyperApp} from "@hyperbridge/core/contracts/apps/HyperApp.sol";
import "@hyperbridge/core/contracts/interfaces/IApp.sol";
import "hardhat/console.sol";

contract TokenReceiver is HyperApp, ReentrancyGuard {
    /* Immutable variables */
    // The deployed MNEE stablecoin on testnet
    IERC20 public immutable mnee;
    IERC20 public immutable feeToken;
    address private _host;

    enum EscrowStatus {
        LOCKED, // funds locked, still awaiting execution
        PARTIAL, // partially released (streams specific)
        COMPLETED, // fully released
        REFUNDED // Probably cancelled, fully refunded to depositor
    }

    struct Escrow {
        address depositor;
        bytes action; // recipient counterpart on destination chain
        uint256 amount;
        uint256 released;
        EscrowStatus status;
    }

    mapping(bytes => Escrow) public escrows;
    uint256 public network = 84532;

    event DepositIntent(
        address indexed from,
        bytes32 indexed actionId,
        bytes body
    );
    event FundsReleased(
        bytes indexed action,
        address indexed recipient,
        uint256 amount
    );
    event Refunded(
        bytes indexed action,
        address indexed depositor,
        uint256 amount
    );

    modifier onlyMessenger() {
        require(msg.sender == _host, "Not messenger");
        _;
    }

    constructor(address _mnee, address _fee) {
        mnee = IERC20(_mnee);
        feeToken = IERC20(_fee);
        console.log("Fee token address:", _fee);
        _host = 0x2EdB74C269948b60ec1000040E104cef0eABaae8;
        IERC20(_fee).approve(_host, type(uint256).max);
    }

    function host() public view override returns (address) {
        return _host;
    }

    function onAccept(
        IncomingPostRequest calldata incoming
    ) external override nonReentrant {
        require(
            keccak256(incoming.request.source) == keccak256(StateMachine.evm(network)),
            "Invalid source chain"
        );

        (bytes memory action, address recipient, uint256 amount) = abi.decode(
            incoming.request.body,
            (bytes, address, uint256)
        );

        Escrow storage escrow = escrows[action];
        require(escrow.released == escrow.amount, "Completed");

        require(escrow.released + amount <= escrow.amount, "Exceeds escrow");

        escrow.released += amount;

        if (escrow.released == escrow.amount) {
            escrow.status = EscrowStatus.COMPLETED;
        }

        mnee.transfer(recipient, amount);

        emit FundsReleased(action, recipient, amount);
    }

    /**
     * @notice Deposit MNEE tokens to be bridged to destination
     * @param receiverAccount The destination account (the H160 format)
     * @param amount The amount of MNEE deposit paid
     */
    function deposit(
        address receiverAccount,
        uint256 amount,
        uint8 actionType,
        bytes calldata action,
        uint256 fee
    ) external nonReentrant {
        // Some amount must be passed
        require(amount > 0, "Amount is zero");
        // Escrow the deposited tokens on source chain
        require(
            mnee.transferFrom(msg.sender, address(this), amount),
            "transfer failed"
        );
        // User pays the contract the fee
        require(
            feeToken.transferFrom(msg.sender, address(this), fee),
            "transfer failed"
        );

        bytes memory body = abi.encode(
            actionType,
            amount, // the actual amount deposited, overwrites what's in the action
            action
        );

        // construct the message to dispatch
        DispatchPost memory post = DispatchPost({
            body: body,
            dest: StateMachine.evm(network),
            timeout: uint64(block.timestamp + 1 hours),
            to: abi.encodePacked(receiverAccount),
            fee: fee, // e.g., 0.1% fee
            payer: address(this) // this should pay and be the origin
        });

        // call bridge messenger to send ISMP message
        try IDispatcher(_host).dispatch(post) returns (bytes32 commitment) {
            /* ---- Create escrow ---- */
            escrows[action] = Escrow({
                depositor: msg.sender,
                action: action,
                amount: amount,
                released: 0,
                status: EscrowStatus.LOCKED
            });

            emit DepositIntent(msg.sender, commitment, body);
        } catch Error(string memory reason) {
            revert(string.concat("DISPATCH_FAILED: ", reason));
        } catch {
            revert("DISPATCH_FAILED: low-level revert");
        }
    }

    /**
     * @notice Refunds remaining funds to depositor
     *         Used when destination action is stopped or expires
     */
    function refund(bytes calldata action) internal nonReentrant {
        Escrow storage escrow = escrows[action];

        require(msg.sender == escrow.depositor, "Only depositor");

        require(
            escrow.status == EscrowStatus.LOCKED ||
                escrow.status == EscrowStatus.PARTIAL,
            "Not refundable"
        );

        uint256 remaining = escrow.amount - escrow.released;

        escrow.status = EscrowStatus.REFUNDED;

        require(mnee.transfer(escrow.depositor, remaining), "Refund failed");

        emit Refunded(action, escrow.depositor, remaining);
    }

    function updateNetworkId(uint256 _network) external {
        network = _network;
    }
}
