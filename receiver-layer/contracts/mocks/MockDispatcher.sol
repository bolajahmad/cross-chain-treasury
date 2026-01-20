// contracts/mocks/MockDispatcher.sol
pragma solidity ^0.8.28;

import "@hyperbridge/core/contracts/interfaces/IDispatcher.sol";
import "@hyperbridge/core/contracts/interfaces/IApp.sol";

contract MockDispatcher {
    bytes32 public lastCommitment;

    function dispatch(
        DispatchPost calldata
    ) external payable returns (bytes32) {
        lastCommitment = keccak256("commitment");
        return lastCommitment;
    }

    function callOnAccept(
        address receiver,
        IncomingPostRequest calldata incoming
    ) external {
        IApp(receiver).onAccept(incoming);
    }
}