// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import {IAction, Action, ActionStatus, ActionType} from "./interfaces/IActions.sol";
import "./library/ExecutorErrors.sol";

contract StreamExecutor {
    uint8 internal constant MAX_CLIFFS = 5;

    function execute(address treasury, bytes32 _id) external {
        IAction _t = IAction(treasury);
        Action memory _a = _t.action(_id);

        if (_a.record.status == ActionStatus.INVALID) {
            revert InvalidAction();
        }

        if (_a.record.actionType == ActionType.STREAM_START) {
            executeStart(_t, _id, _a);
        } else if (_a.record.actionType == ActionType.STREAM_STOP) {
            // implement stream stop logic
            executeStop(_t, _id, _a);
        } else {
            revert InvalidAction();
        }
    }

    function executeStart(IAction _t, bytes32 _id, Action memory _a) internal {
        require(
            _a.record.status == ActionStatus.PENDING ||
                _a.record.status == ActionStatus.EXECUTED,
            "Inactive Stream"
        );

        // decode the stored byte
        (
            address _recipient,
            uint256 _amount,
            uint64 _startTime,
            uint64 _cliff
        ) = abi.decode(_a.record.data, (address, uint256, uint64, uint64));

        uint8 paid = _t.cliffsPaid(_id);
        uint256 unlocked = (block.timestamp - _startTime) / _cliff;
        if (unlocked > MAX_CLIFFS) {
            unlocked = uint256(MAX_CLIFFS);
        }
        // Ensure deadline has passed
        if (
            _cliff <= 0 ||
            block.timestamp < _startTime ||
            paid > MAX_CLIFFS ||
            unlocked <= paid
        ) {
            revert InvalidStreamParameters();
        }

        uint256 perCliff = _amount / MAX_CLIFFS;
        uint256 toPay = (unlocked - paid) * perCliff;
        if (_t.lockedBalance(_a.token) < toPay) {
            revert InsufficientFunds();
        }

        // Release the payment
        _t.makePayout(_a.token, _id, _recipient, toPay);

        if (unlocked == MAX_CLIFFS) {
            // Finalize state updates
            // _a.record.status = ActionStatus.EXECUTED;
            _t.finalizeAction(_id);
        }
    }

    function executeStop(IAction _t, bytes32 _id, Action memory _a) internal {
        bytes32 targetId = abi.decode(_a.record.data, (bytes32));
        Action memory stream = _t.action(targetId);
        require(
            stream.record.status != ActionStatus.INVALID &&
                stream.record.actionType == ActionType.STREAM_START,
            "Invalid Stream Action"
        );
        if (stream.record.status == ActionStatus.EXECUTED) {
            uint8 count = _t.cliffsPaid(targetId);
            require(count < MAX_CLIFFS, "Stream already completed");
        } else {
            require(
                stream.record.status != ActionStatus.STOPPED,
                "Stream already stopped"
            );
        }

        // decode the underlying stream start action
        (, uint256 _amount, , ) = abi.decode(
            stream.record.data,
            (address, uint256, uint64, uint64)
        );
        uint8 paid = _t.cliffsPaid(targetId);
        uint256 perCliff = _amount / uint256(MAX_CLIFFS);
        uint256 refund = _amount - (perCliff * paid);

        if (_t.lockedBalance(stream.token) < refund) {
            revert InsufficientFunds();
        }

        // Refund the remaining locked balance to treasury
        _t.makePayout(stream.token, _id, stream.record.creator, refund);

        _t.finalizeAction(targetId);
        _t.finalizeAction(_id);
    }

    function executePause(IAction _t, bytes32 _id, Action memory _a) internal {
        bytes32 targetId = abi.decode(_a.record.data, (bytes32));
        Action memory target = _t.action(targetId);

        require(
            target.record.status != ActionStatus.INVALID,
            "Invalid Stream Action"
        );
        require(
            target.record.status == ActionStatus.PENDING,
            "Can only pause active streams"
        );

        _t.updateStatus(targetId, ActionStatus.PAUSED);

        _t.finalizeAction(_id);
    }

    function executeResume(IAction _t, bytes32 _id, Action memory _a) internal {
        bytes32 targetId = abi.decode(_a.record.data, (bytes32));
        Action memory target = _t.action(targetId);

        require(
            target.record.status != ActionStatus.INVALID,
            "Invalid Stream Action"
        );
        require(
            target.record.status == ActionStatus.PAUSED,
            "Can only resume paused streams"
        );

        if (_t.cliffsPaid(targetId) > 0) {
            _t.updateStatus(targetId, ActionStatus.EXECUTED);
        } else {
            _t.updateStatus(targetId, ActionStatus.PENDING);
        }

        _t.finalizeAction(_id);
    }
}
