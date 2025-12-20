// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/ITreasuryController.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

contract Treasury is Ownable {
    uint256 private maxActions$;

    address public controller;
    uint256 public actionCount;
    // bytes32 represents the actionID
    mapping(bytes32 => ActionRecord) public actions;
    mapping(bytes32 => uint8) private streams;

    modifier onlyUniqueId(bytes32 _id) {
        require(!actions[_id].exists, "Only Unique IDs");
        _;
    }
    modifier onlyValidType(uint8 _id) {
        require(_id > 0 && _id <= maxActions$, "Invalid ID");
        _;
    }

    event ActionCreated(bytes32 indexed id, ActionType actionType, bytes params);
    event TreasuryExecution(bytes32 indexed id, ActionType actionType,uint256 amount, bytes params);

    constructor(uint256 _maxActions, address _controller) Ownable(msg.sender) {
        maxActions$ = _maxActions;
        controller = _controller;
    }

    function createAction(bytes32 _id, uint8 _type, bytes calldata _params)
        public
        onlyUniqueId(_id) // Verify that the _id is unique
        onlyValidType(_type) // Type must be greater than 0 & less than maxActions$
    {
        require(msg.sender == controller, "Only Controller");
        ActionRecord memory record = ActionRecord({
            status: ActionStatus.PENDING,
            actionType: ActionType(_type - 1),
            exists: true,
            dataHash: _params,
            executedAt: 0
        });
        actions[_id] = record;
        actionCount += 1;

        emit ActionCreated(_id, record.actionType, _params);
    }

    function executeTreasuryAction(bytes32 _id) public {
        ActionRecord memory action = actions[_id];
        require(action.exists, "Action does not exist");
        ActionType actionType = action.actionType;

        

        if (actionType == ActionType.PAYOUT) {
            (address recipient, uint256 amount, uint32 _token) = abi.decode(action.dataHash, (address, uint256, uint32));
            // ensure there's enough balance to pay
            if (address(this).balance > amount) {
                // Once PAYOUT is done, delete the record
                delete actions[_id];

                (bool sent,) = payable(recipient).call{value: amount}("");
                require(sent, "Failed to send Ether");
                action.status = ActionStatus.EXECUTED;
                action.executedAt = block.timestamp;
                emit TreasuryExecution(_id, actionType, amount, action.dataHash);
            }
        } else if (actionType == ActionType.BATCH_PAYOUT) {
            Payout[] memory payouts = abi.decode(action.dataHash, (Payout[]));
            // Length should not exceed 50
            require(payouts.length <= 50, "Exceeds max batch size");
            // Get the total amount to be paid
            uint256 totalAmount = 0;
            for (uint256 i = 0; i < payouts.length; i++) {
                totalAmount += payouts[i].amount;
            }
            // ensure there's enough balance to pay
            require(address(this).balance >= totalAmount, "Insufficient Balance");

            // Lenght is within limit and enough funds to pay
            for (uint256 i = 0; i < payouts.length; i++) {
                (bool sent,) = payable(payouts[i].recipient).call{value: payouts[i].amount}("");
                require(sent, "Failed to send Ether");
            }
            // Once BATCH_PAYOUT is done, delete the record
            delete actions[_id];
            action.status = ActionStatus.EXECUTED;
            action.executedAt = block.timestamp;
            emit TreasuryExecution(_id, actionType, totalAmount, action.dataHash);
        } else if (actionType == ActionType.STREAM_START) {
            // decode the parameters
            (address recipient, uint256 amount, uint64 duration, uint64 cliff) = abi.decode(action.dataHash, (address, uint256, uint64, uint64));
            // Ensure deadline has passed
            require(block.timestamp >= duration, "Deadline not reached");
            uint8 currstreams = streams[_id];
            require(currstreams < 4, "Max streams reached");

            // Start the stream logic
            // check the number of cliffs exhausted
            // (timestamp - duration) / cliff
            // number of cliff must be greater than currstreams
            // calculate the amount per cliff by dividing amount/total_cliff
            // amount to pay is the (cliffs_exhausted - currstreams) * amount per cliff
            uint256 cliffsExhausted = (block.timestamp - duration) / cliff;
            require(cliffsExhausted > currstreams, "No new cliffs exhausted");
            uint256 amountPerCliff = amount / 5;
            uint256 amountToPay = (cliffsExhausted - currstreams) * amountPerCliff;
            require(address(this).balance >= amountToPay, "Insufficient Balance");
            // Pay the amount
            (bool sent,) = payable(recipient).call{value: amountToPay}("");
            require(sent, "Failed to send Ether");
            // Update the streams mapping
            streams[_id] = uint8(cliffsExhausted);
            action.status = ActionStatus.EXECUTED;
            action.executedAt = block.timestamp;
            emit TreasuryExecution(_id, actionType, amountToPay, action.dataHash);
        } else {
            revert("Invalid Action Type");
        }
    }
}