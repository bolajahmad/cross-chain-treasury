// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {HyperApp} from "@hyperbridge/core/contracts/apps/HyperApp.sol";
import "@hyperbridge/core/contracts/interfaces/IApp.sol";
import "./interfaces/ITreasuryController.sol";
import { ITreasury} from "./Treasury.sol";

contract TreasuryController is HyperApp {
    event PostReceived(address indexed recipient, bytes indexed action, uint256 amount);
    
    // IIsmpHost Address
    address private _host;
    ITreasury public treasury;

    constructor(address ismpHost, address treasuryAddress) {
        _host = ismpHost;
        treasury = ITreasury(treasuryAddress);
    }

    function host() public view override returns (address) {
        return _host;
    }

    function onAccept(IncomingPostRequest memory incoming)
        external
        override
    {
        // decode the received action
        (address _recipient, uint256 _amount, bytes memory _action) = abi.decode(incoming.request.body, (address, uint256, bytes));
        (bytes32 _id, uint8 _type, bytes memory _data) = abi.decode(_action, (bytes32, uint8, bytes));
        // decode request body
        // make any necessary state changes
        try treasury.createAction(_id, _type, _data) {
            emit PostReceived(_recipient, _action, _amount);
        } catch  {
            revert UnexpectedCall();
        }
    }
}