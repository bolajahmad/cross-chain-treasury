// contracts/mocks/MockDispatcher.sol
pragma solidity ^0.8.28;

import "@hyperbridge/core/contracts/interfaces/IDispatcher.sol";
import "@hyperbridge/core/contracts/interfaces/IApp.sol";

contract MockTreasury {
    uint256 private maxActions$;
    bytes32 public lastActionId;

    constructor(uint256 _max) {
        maxActions$ = _max;
    }

    function createAction(
        bytes32 _id,
        uint8 _type,
        bytes calldata _params
    ) external {
        lastActionId = _id;
    }
    
    function maxActions() public view returns (uint256) {
        return maxActions$;
    }
}