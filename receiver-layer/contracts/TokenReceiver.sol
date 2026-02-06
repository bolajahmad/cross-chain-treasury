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
    IERC20 public immutable feeToken; // Hyperbridge fee token for the chain
    address private immutable _host; // The Hyperbridge host contract address

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
        address token; // The token address, for future multi-token support
        EscrowStatus status;
    }

    // Map the keccak256 of action bytes to the escrow, avoids decoding here
    mapping(bytes32 => Escrow) public escrows;
    // Mapping of (token address => amount) of tokens locked in active streams
    mapping(address => uint256) public lockedBalances;
    // Mapping of sent messages to keep track till finalization, maps commitmentId => keccak256(actionId)
    mapping(bytes32 => bytes32) public sentMessages;
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
    event Log(string func, uint256 gas);

    /**
     * Initializes a new TokenReceiver contract
     * This also triggers the approval of fee token to the host contract
     * @param _fee the fee token address
     * @param _h The host contract address for hyperbridge
     */
    constructor(address _fee, address _h) {
        feeToken = IERC20(_fee);
        _host = _h;
        IERC20(_fee).approve(_host, type(uint256).max);
    }

    function host() public view override returns (address) {
        return _host;
    }

    /**
     * Called whenever a Hyperbridge message is received
     * @param incoming The incoming post request containing the message
     */
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

            IERC20(escrow.token).transfer(recipient, amount);
            emit FundsReleased(action, recipient, amount);
        }
    }

    /**
     * @notice Deposit specified tokens to be bridged to destination
     * @param actionType specifies the type of action to execute, defined by the Actions contract
     * @param action ABI-encoded information about the action to create
     * @param toContract The destination ActionController contract
     * @param amount The amount of tokens deposit paid
     * @param token The address of the ERC20 token to lock
     * @param fee Hyperbridge expected fee to deliver the message
     */
    function deposit(
        uint8 actionType,
        bytes calldata action,
        address toContract,
        uint256 amount,
        address token,
        uint256 fee
    ) external payable nonReentrant {
        // Some amount must be passed
        require(amount > 0 || msg.value > 0, "Amount is zero");
        // Escrow the deposited tokens on source chain
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
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
            timeout: uint64(0), // No timeout
            to: abi.encodePacked(toContract),
            fee: fee, // e.g., 0.1% fee
            payer: address(msg.sender) // `this` will pay but msg.sender will get potential refunds
        });

        // call bridge messenger to send ISMP message
        try IDispatcher(_host).dispatch(post) returns (bytes32 commitment) {
            /* ---- Create escrow ---- */
            escrows[keccak256(action)] = Escrow({
                depositor: msg.sender,
                amount: amount,
                released: 0,
                token: token,
                status: EscrowStatus.LOCKED
            });
            lockedBalances[token] += amount;
            sentMessages[commitment] = keccak256(action);

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

        require(IERC20(escrow.token).transfer(escrow.depositor, remaining), "Refund failed");

        emit Refunded(action, escrow.depositor, remaining);
    }

    function updateNetworkId(uint256 _network) external {
        network = _network;
    }

    function currentNetwork() external view returns (bytes memory) {
        return StateMachine.evm(network);
    }

    fallback() external payable {
        // send / transfer (forwards 2300 gas to this fallback function)
        // call (forwards all of the gas)
        lockedBalances[address(0)] += msg.value;
        emit Log("fallback", gasleft());
    }

    receive() external payable {
        lockedBalances[address(0)] += msg.value;
        emit Log("receive", gasleft());
    }
}
