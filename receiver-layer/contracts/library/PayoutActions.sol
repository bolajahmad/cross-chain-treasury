// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../interfaces/ITreasury.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library PayoutActions {
    function executePayout(ActionStorage storage _self, bytes32 _id) internal {
        ActionRecord storage record = _self.actions[_id].record;
        address token = _self.actions[_id].token;
        require(record.status == ActionStatus.PENDING, "Inactive Payout");

        // decode the payout params
        (address _recipient, uint256 _amount, , ) = abi.decode(
            record.data,
            (address, uint256, address, bytes)
        );
        require(_self.lockedBalances[token] >= _amount, "Insufficient funds");
        _self.lockedBalances[token] -= _amount;

        // Transfer the amount to the recipient
        if (token == address(0)) {
            (bool sent, ) = payable(_recipient).call{value: _amount}("");
            require(sent, "Token transfer failed");
        } else {
            require(
                IERC20(token).transfer(_recipient, _amount),
                "ERC20 transfer failed"
            );
        }

        record.status = ActionStatus.EXECUTED;
        record.executedAt = block.timestamp;

        delete _self.actions[_id];
    }

    function executeBatchPayout(
        ActionStorage storage _self,
        bytes32 _id
    ) internal {
        ActionRecord storage record = _self.actions[_id].record;
        address token = _self.actions[_id].token;
        require(record.status == ActionStatus.PENDING, "Inactive Payout");

        // decode the payout params
        (address[] memory _recipients, uint256[] memory _amounts, , ) = abi
            .decode(record.data, (address[], uint256[], address, bytes));
        require(
            _recipients.length == _amounts.length && _recipients.length <= 50,
            "Too many recipients"
        );
        // Get total amount to pay
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            totalAmount += _amounts[i];
        }
        require(_self.lockedBalances[token] >= totalAmount, "Insufficient funds");
        _self.lockedBalances[token] -= totalAmount;

        // Pay each _recipient in a loop
        for (uint256 i = 0; i < _recipients.length; i++) {
            if (token == address(0)) {
                (bool sent, ) = payable(_recipients[i]).call{value: _amounts[i]}(
                    ""
                );
                require(sent, "Token transfer failed");
            } else {
                require(
                    IERC20(token).transfer(_recipients[i], _amounts[i]),
                    "ERC20 transfer failed"
                );
            }
        }

        record.status = ActionStatus.EXECUTED;
        record.executedAt = block.timestamp;

        delete _self.actions[_id];
    }
}
