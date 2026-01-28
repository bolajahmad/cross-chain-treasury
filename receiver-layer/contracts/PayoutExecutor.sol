// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import {IAction, Action, ActionStatus, ActionType} from "./interfaces/ITreasury.sol";
import "./library/ExecutorErrors.sol";

contract PayoutExecutor {
    function execute(address treasury, bytes32 id) external {
        IAction _t = IAction(treasury);
        Action memory action = _t.action(id);

        if (action.record.status != ActionStatus.PENDING) {
            revert InvalidAction();
        }

        (address[] memory recipients, uint256[] memory amounts) = decodePayout(
            action.record.data,
            action.record.actionType == ActionType.BATCH_PAYOUT
        );

        require(recipients.length == amounts.length, "Length mismatched");
        require(recipients.length <= 50, "Too many recipients");

        uint256 total;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }

        if (_t.lockedBalance(action.token) < total) {
            revert InsufficientFunds();
        }

        for (uint256 i = 0; i < recipients.length; i++) {
            _t.makePayout(action.token, id, recipients[i], amounts[i]);
        }
    }

    function decodePayout(
        bytes memory _a,
        bool isBatch
    ) internal pure returns (address[] memory, uint256[] memory) {
        if (isBatch) {
            (address[] memory recipients, uint256[] memory amounts, , ) = abi
                .decode(_a, (address[], uint256[], address, bytes));
            return (recipients, amounts);
        } else {
            (address recipient, uint256 amount, , ) = abi.decode(
                _a,
                (address, uint256, address, bytes)
            );
            address[] memory recipients = new address[](1);
            uint256[] memory amounts = new uint256[](1);
            recipients[0] = recipient;
            amounts[0] = amount;
            return (recipients, amounts);
        }
    }
}
