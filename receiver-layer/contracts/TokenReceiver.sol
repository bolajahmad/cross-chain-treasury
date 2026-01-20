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
    IERC20 public immutable feeToken; // Hyperbridge fee token for the chain

    address private immutable _host;

    enum EscrowStatus {
        LOCKED, // funds locked, still awaiting execution
        PARTIAL, // partially released (streams specific)
        COMPLETED, // fully released
        REFUNDED // Probably cancelled, fully refunded to depositor
    }

    struct Escrow {
        address depositor; // The action creator, will get the refund if any
        uint256 amount; // The amount sent to the contract, precedes the encoded value
        uint256 released; // Amount already released to recipient, if stream action
        EscrowStatus status;
    }

    // Map the action bytes to the escrow, acoids decoding here
    mapping(bytes32 => Escrow) public escrows;
    // TODO: should ideally be a byte,
    // Using uint256 assumes this will only work for EVM chain
    uint256 public network = 84532;

    event DepositIntent(
        address indexed from,
        bytes indexed action,
        bytes body,
        bytes32 commitmentId
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

    constructor(address _mnee, address _fee, address _h) {
        mnee = IERC20(_mnee);
        feeToken = IERC20(_fee);
        console.log("Fee token address:", _fee);
        _host = _h;
        IERC20(_fee).approve(_host, type(uint256).max);
    }

    function host() public view override returns (address) {
        return _host;
    }

    function onAccept(
        IncomingPostRequest calldata incoming
    ) external override nonReentrant onlyHost {
        require(
            keccak256(incoming.request.source) ==
                keccak256(StateMachine.evm(network)),
            "Invalid source chain"
        );

        (
            bytes memory action,
            address recipient,
            uint256 amount,
            uint8 actionType
        ) = abi.decode(incoming.request.body, (bytes, address, uint256, uint8));

        if (actionType == 3) {
            refund(action);
        } else {
            Escrow storage escrow = escrows[keccak256(action)];
            require(escrow.released != escrow.amount, "Completed");

            require(
                escrow.released + amount <= escrow.amount,
                "Exceeds escrow"
            );

            if (actionType != 1) {
                require(amount == escrow.amount, "Invalid amount");
            }
            escrow.released += amount;

            if (escrow.released == escrow.amount) {
                escrow.status = EscrowStatus.COMPLETED;
            } else {
                escrow.status = EscrowStatus.PARTIAL;
            }

            mnee.transfer(recipient, amount);
            emit FundsReleased(action, recipient, amount);
        }
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

        bytes memory body = abi.encode(actionType, amount, action);

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
            escrows[keccak256(action)] = Escrow({
                depositor: msg.sender,
                amount: amount,
                released: 0,
                status: EscrowStatus.LOCKED
            });

            emit DepositIntent(msg.sender, action, body, commitment);
        } catch Error(string memory reason) {
            revert(string.concat("DISPATCH_FAILED: ", reason));
        } catch {
            revert("DISPATCH_FAILED: low-level revert");
        }
    }

    /**
     * @notice Refunds remaining funds to depositor
     *         Used when destination action is stopped
     */
    function refund(bytes memory action) internal {
        Escrow storage escrow = escrows[keccak256(action)];

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

    function currentNetwork() external view returns (bytes memory) {
        return StateMachine.evm(network);
    }
}
