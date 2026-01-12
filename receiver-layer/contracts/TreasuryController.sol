// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {HyperApp} from "@hyperbridge/core/contracts/apps/HyperApp.sol";
import "@hyperbridge/core/contracts/interfaces/IApp.sol";
import "./interfaces/ITreasuryController.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

contract TreasuryController is HyperApp, Ownable {
    event PostReceived(
        address indexed recipient,
        bytes32 indexed actionId,
        uint256 amount
    );

    // IIsmpHost Address
    address private _host;
    ITreasury public treasury;

    constructor(address ismpHost, address treasuryAddress) Ownable(msg.sender) {
        _host = ismpHost;
        treasury = ITreasury(treasuryAddress);
    }

    function host() public view override returns (address) {
        return _host;
    }

    function onAccept(IncomingPostRequest memory incoming) external override {
        // decode the received action
        (uint8 _actionType, uint256 _amount, bytes memory _action) = abi.decode(
            incoming.request.body,
            (uint8, uint256, bytes)
        );
        (, uint256 value, , bytes memory _metadata) = abi.decode(
            _action,
            (address, uint256, address, bytes)
        );

        require(_amount == value, "Amount mismatch");
        // decode request body
        bytes32 actionId = sha256(_metadata);
        // make any necessary state changes
        try treasury.createAction(actionId, _actionType, _action) {
            emit PostReceived(incoming.relayer, actionId, _amount);
        } catch {
            emit PostReceived(address(this), actionId, 0);
            revert UnexpectedCall();
        }
    }

    function changeTreasury(address _treasury) external onlyOwner {
        treasury = ITreasury(_treasury);
    }
}
