// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../interfaces/ITreasury.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library StreamActions {
    uint8 internal constant MAX_CLIFFS = 5;

    function executeStreamStart(
        ActionStorage storage _self,
        bytes32 _id
    ) internal {
        // Get the action record
        ActionRecord storage record = _self.actions[_id].record;
        address token = _self.actions[_id].token;
        require(
            record.status == ActionStatus.PENDING ||
                record.status == ActionStatus.EXECUTED,
            "Inactive Stream"
        );

        // decode the stored byte
        (
            address _recipient,
            uint256 _amount,
            uint64 _startTime,
            uint64 _cliff
        ) = abi.decode(record.data, (address, uint256, uint64, uint64));
        uint8 paid = _self.cliffsPaid[_id];
        uint256 unlocked = (block.timestamp - _startTime) / _cliff;
        if (unlocked > MAX_CLIFFS) {
            unlocked = uint256(MAX_CLIFFS);
        }

        // Ensure deadline has passed
        require(_cliff > 0, "Invalid Cliff");
        require(block.timestamp >= _startTime, "Stream not started!");
        require(paid <= MAX_CLIFFS, "Max streams reached");
        require(unlocked > paid, "No new cliffs unlocked");

        uint256 amountPerCliff = _amount / MAX_CLIFFS;
        uint256 toPay = (unlocked - paid) * amountPerCliff;

        // Transition the clifsPaid state
        _self.cliffsPaid[_id] = uint8(unlocked);
        // ensure there's enough tokens locked to pay
        require(
            _self.lockedBalances[token] >= toPay,
            "Insufficient locked funds"
        );
        _self.lockedBalances[token] -= toPay;

        // actually release the due funds
        if (token == address(0)) {
            // Transfer native tokens
            (bool sent, ) = payable(_recipient).call{value: toPay}("");
            require(sent, "Token transfer failed");
        } else {
            require(
                IERC20(token).transfer(_recipient, toPay),
                "Token transfer failed"
            );
        }

        // Finalise state updates
        if (unlocked == MAX_CLIFFS) {
            record.status = ActionStatus.EXECUTED;
            record.executedAt = block.timestamp;
            delete _self.cliffsPaid[_id];
            delete _self.actions[_id];
        }
    }

    function executeStreamStop(
        ActionStorage storage _self,
        bytes32 _id
    ) internal {
        // retrive the action, it must exist
        ActionRecord storage record = _self.actions[_id].record;
        require(record.status != ActionStatus.INVALID, "Invalid action");

        // decode the undelying action to stop
        bytes32 actionId = abi.decode(record.data, (bytes32));
        ActionRecord storage action = _self.actions[actionId].record;
        address token = _self.actions[actionId].token;

        require(
            action.status != ActionStatus.INVALID &&
                action.actionType == ActionType.STREAM_START,
            "Invalid Action ID"
        );

        // Ensure action can be stopped
        require(action.status != ActionStatus.INVALID, "Invalid Action Type");
        if (action.status == ActionStatus.EXECUTED) {
            uint8 count = _self.cliffsPaid[_id];
            require(count >= MAX_CLIFFS, "Stream already completed");
        } else {
            require(
                action.status != ActionStatus.STOPPED,
                "Stream already stopped"
            );
        }

        // decode the underlying stream start action
        (, uint256 _amount, , ) = abi.decode(
            action.data,
            (address, uint256, uint64, uint64)
        );
        uint8 paid = _self.cliffsPaid[actionId];
        uint256 amountPerCliff = _amount / uint256(MAX_CLIFFS);
        uint256 withdrawalAmount = _amount - (amountPerCliff * paid);

        require(
            _self.lockedBalances[token] >= withdrawalAmount,
            "Insufficient funds"
        );
        // update locked balances
        _self.lockedBalances[token] -= withdrawalAmount;

        if (token == address(this)) {
            (bool sent, ) = payable(action.creator).call{
                value: withdrawalAmount
            }("");
            require(sent, "Token transfer failed");
        } else {
            require(
                IERC20(token).transfer(action.creator, withdrawalAmount),
                "Unable to transfer tokens"
            );
        }

        delete _self.actions[_id];
    }

    function executePause(ActionStorage storage _self, bytes32 _id) internal {
        ActionRecord storage record = _self.actions[_id].record;
        require(record.status != ActionStatus.INVALID, "Action does not exist");

        // decode the underlying action to pause
        bytes32 actionId = abi.decode(record.data, (bytes32));
        ActionRecord memory action = _self.actions[actionId].record;
        action.status = ActionStatus.PAUSED;
        _self.actions[actionId].record = action;

        delete _self.actions[_id];
    }

    function executeResume(ActionStorage storage _self, bytes32 _id) internal {
        ActionRecord storage record = _self.actions[_id].record;
        require(record.status != ActionStatus.INVALID, "Action does not exist");

        // decode the underlying action to pause
        bytes32 actionId = abi.decode(record.data, (bytes32));
        ActionRecord memory action = _self.actions[actionId].record;
        if (record.actionType == ActionType.STREAM_START) {
            if (_self.cliffsPaid[actionId] > 0) {
                record.status = ActionStatus.EXECUTED;
            }
        } else {
            record.status = ActionStatus.PENDING;
        }
        _self.actions[actionId].record = action;

        delete _self.actions[_id];
    }
}
