// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IIsmpModule.sol";
import "./interfaces/ITreasuryController.sol";

contract TreasuryController is BaseIsmpModule {
    event PostReceived();

    // IIsmpHost Address
    address private _host;

    bool public hasReceived;

    constructor(address ismpHost) {
        _host = ismpHost;
        hasReceived = false;
    }

    function host() public view override returns (address) {
        return _host;
    }

    function onAccept(IncomingPostRequest memory incoming)
        external
        override
    {
        // decode request body
        // make any necessary state changes
        hasReceived = !hasReceived;
        emit PostReceived();
    }
}