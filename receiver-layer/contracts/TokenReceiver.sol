// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@hyperbridge/core/contracts/libraries/StateMachine.sol";
import "@hyperbridge/core/contracts/interfaces/IDispatcher.sol";
import {HyperApp} from "@hyperbridge/core/contracts/apps/HyperApp.sol";
import "hardhat/console.sol";

contract TokenReceiver {
    /* Constant data */
    // The deployed IsmpHost contract on ETH Sepolia
    address public constant MESSENGER_HOST = 0x2EdB74C269948b60ec1000040E104cef0eABaae8; // TODO: Switch to mainnet before prod

    /* Immutable variables */
    // The deployed MNEE stablecoin on testnet
    IERC20 public immutable mnee;

    mapping(address => uint256) public deposits;
    bytes public destination;
    uint256 public totalDeposits;

    event DepositIntent(address indexed from, uint256 amount, address destination, bytes action);

    constructor(address _mnee, bytes memory _destination) {
        mnee = IERC20(_mnee);
        destination = _destination;
        console.log("destination set");
        try IDispatcher(MESSENGER_HOST).feeToken() returns (address feeToken) {
            // Note: In production, you'd want to handle this more carefully
            // For hackathon, we'll assume the contract has sufficient tokens
            console.log("Fee token address:", feeToken);
            IERC20(0xA801da100bF16D07F668F4A49E1f71fc54D05177).approve(MESSENGER_HOST, type(uint256).max);
        } catch {
            console.log("Could not get fee token from dispatcher");
        }
    }

    /**
    * @notice Deposit MNEE tokens to be bridged to Polkadot
    * @param receiverAccount The destination Polkadot account (the H160 format)
    * @param amount The amount of MNEE deposit paid
     */
    function deposit(address receiverAccount, uint256 amount, bytes calldata action, uint256 fee) payable external {
        // require(mnee.transferFrom(msg.sender, address(this), amount), "transfer failed");
        address feeToken = IDispatcher(MESSENGER_HOST).feeToken();
        require(IERC20(feeToken).transferFrom(msg.sender, address(this), amount), "transfer failed");
       
        // estimate the fees
        // uint256 perByteFee = IDispatcher(MESSENGER_HOST).perByteFee(destination);
        // uint256 fees = action.length * perByteFee;

        // increase deposit of the msg.sender
        deposits[msg.sender] += amount;
        totalDeposits += 1;

        // construct the message to dispatch
        DispatchPost memory post = DispatchPost({
            body: action,
            dest: destination,
            timeout: uint64(block.timestamp + 1 hours),
            to: abi.encodePacked(receiverAccount),
            fee: fee,  // e.g., 0.1% fee
            payer: address(this) // this thould pay and be the origin
        });
        
        // call bridge messenger to send ISMP message
        try IDispatcher(MESSENGER_HOST).dispatch(post) returns (bytes32 commitment) {
            emit DepositIntent(msg.sender, amount, receiverAccount, action);
        } catch Error(string memory reason) {
            revert(string.concat("DISPATCH_FAILED: ", reason));
        } catch {
            revert("DISPATCH_FAILED: low-level revert");
        }

        // Optionally escrow locally until bridge confirms
         
    }
}
