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
    IERC20 public immutable feeToken;

    mapping(address => uint256) public deposits;
    uint256 public totalDeposits;

    event DepositIntent(address indexed from, bytes32 indexed commitment, bytes body);

    constructor(address _mnee, address _fee) {
        mnee = IERC20(_mnee);
        feeToken = IERC20(_fee);
        console.log("Fee token address:", _fee);
        IERC20(_fee).approve(MESSENGER_HOST, type(uint256).max);
    }

    /**
    * @notice Deposit MNEE tokens to be bridged to Polkadot
    * @param receiverAccount The destination Polkadot account (the H160 format)
    * @param amount The amount of MNEE deposit paid
     */
    function deposit(address receiverAccount, uint256 amount, bytes calldata action, uint256 fee) payable external {
        // Escrow the deposited tokens on source chain
        require(mnee.transferFrom(msg.sender, address(this), amount), "transfer failed");
        // User pays the contract the fee
        require(feeToken.transferFrom(msg.sender, address(this), fee), "transfer failed");
       
        // increase deposit of the msg.sender
        deposits[msg.sender] += amount;
        totalDeposits += amount;
        bytes memory body = abi.encode(
            receiverAccount,
            amount,
            action
        );

        // construct the message to dispatch
        DispatchPost memory post = DispatchPost({
            body: body,
            dest: StateMachine.evm(84532),
            timeout: uint64(block.timestamp + 1 hours),
            to: abi.encodePacked(receiverAccount),
            fee: fee,  // e.g., 0.1% fee
            payer: address(this) // this should pay and be the origin
        });
        
        // call bridge messenger to send ISMP message
        try IDispatcher(MESSENGER_HOST).dispatch(post) returns (bytes32 commitment) {
            emit DepositIntent(msg.sender, commitment, body);
        } catch Error(string memory reason) {
            revert(string.concat("DISPATCH_FAILED: ", reason));
        } catch {
            revert("DISPATCH_FAILED: low-level revert");
        }
    }
}
