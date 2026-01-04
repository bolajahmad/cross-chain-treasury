// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./library/StateMachine.sol";
import "./interfaces/IDispatcher.sol";

contract TokenReceiver {
    /* Constant data */
    // The deployed IsmpHost contract on ETH Sepolia
    address public constant MESSENGER_HOST = 0x2EdB74C269948b60ec1000040E104cef0eABaae8; // TODO: Switch to mainnet before prod

    /* Immutable variables */
    // The deployed MNEE stablecoin on testnet
    IERC20 public immutable mnee;

    mapping(address => uint256) public deposits;
    uint256 public totalDeposits;

    event DepositIntent(address indexed from, uint256 amount, address destination, bytes action);

    constructor(address _mnee) {
        mnee = IERC20(_mnee);
    }

    /**
    * @notice Deposit MNEE tokens to be bridged to Polkadot
    * @param receiverAccount The destination Polkadot account (the H160 format)
    * @param amount The amount of MNEE deposit paid
     */
    function deposit(address receiverAccount, uint256 amount, bytes calldata action) payable external {
        // require(mnee.transferFrom(msg.sender, address(this), amount), "transfer failed");

        // increase deposit of the msg.sender
        deposits[msg.sender] += amount;
        totalDeposits += 1;

        // construct the message to dispatch
        DispatchPost memory post = DispatchPost({
            body: action,
            dest: StateMachine.evm(80002),
            timeout: uint64(block.timestamp + 1 hours),
            to: abi.encodePacked(receiverAccount),
            fee: amount * 1 / 1000,  // e.g., 0.1% fee
            payer: tx.origin
        });
        bytes32 commitment = IDispatcher(MESSENGER_HOST).dispatch(post);
        
        try IDispatcher(MESSENGER_HOST).dispatch(post) returns (bytes32 commitment) {
            emit DepositIntent(msg.sender, amount, receiverAccount, action);
        } catch Error(string memory reason) {
            revert(string.concat("DISPATCH_FAILED: ", reason));
        } catch {
            revert("DISPATCH_FAILED: low-level revert");
        }

        // Optionally escrow locally until bridge confirms
        
        // call bridge messenger to send ISMP message 
    }
}
