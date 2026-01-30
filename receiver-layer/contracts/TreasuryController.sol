// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {HyperApp} from "@hyperbridge/core/contracts/apps/HyperApp.sol";
import "@hyperbridge/core/contracts/interfaces/IApp.sol";
import "@hyperbridge/core/contracts/libraries/StateMachine.sol";
import "@hyperbridge/core/contracts/interfaces/IDispatcher.sol";
import "./interfaces/IActions.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

contract TreasuryController is HyperApp, Ownable {
    // IIsmpHost Address
    address private _host;

    bytes public SOURCE_CHAIN;
    bytes public SOURCE_APP; // Token receiver on source chain

    IAction public treasury;
    mapping(bytes => bool) public processed;

    event ActionReceived(
        address indexed recipient,
        bytes32 indexed actionId,
        uint256 amount
    );

    constructor(
        address ismpHost,
        address treasuryAddress,
        uint256 sourceChainId,
        bytes memory sourceApp
    ) Ownable(msg.sender) {
        _host = ismpHost;
        treasury = IAction(treasuryAddress);
        SOURCE_CHAIN = StateMachine.evm(sourceChainId);
        SOURCE_APP = sourceApp;
    }

    function host() public view override returns (address) {
        return _host;
    }

    function onAccept(IncomingPostRequest memory incoming) external override onlyHost {
        // Verify the origin of message
        require(
            keccak256(incoming.request.source) == keccak256(SOURCE_CHAIN),
            "Invalid source chain"
        );
        require(
            keccak256(incoming.request.from) == keccak256(SOURCE_APP),
            "Invalid source app"
        );

        // decode the received action
        (uint8 _actionType, uint256 _amount, bytes memory _action) = abi.decode(
            incoming.request.body,
            (uint8, uint256, bytes)
        );
        // ActionType must be valid
        require(_actionType <= treasury.maxActions(), "Invalid action type");
        (, uint256 value, , bytes memory _metadata) = abi.decode(
            _action,
            (address, uint256, address, bytes)
        );

        /* ---- Replay protection ---- */
        require(!processed[_action], "Already processed");
        processed[_action] = true;
        require(_amount == value, "Amount mismatch");

        // decode request body
        bytes32 actionId = sha256(_metadata);

        // make any necessary state changes
        try treasury.createAction(actionId, _actionType, _action) {
            emit ActionReceived(incoming.relayer, actionId, _amount);
        } catch {
            emit ActionReceived(address(this), actionId, 0);
            revert UnexpectedCall();
        }
    }

    function relayExecutionResult(bytes calldata action) external {
        require(msg.sender == address(treasury), "Only treasury can call");

        DispatchPost memory post = DispatchPost({
            body: action,
            dest: SOURCE_CHAIN,
            timeout: uint64(block.timestamp + 1 hours),
            to: abi.encodePacked(SOURCE_APP),
            fee: 0,
            payer: address(this)
        });

        // call bridge messenger to send ISMP message
        IDispatcher(_host).dispatch(post);
    }

    function changeTreasury(address _treasury) external onlyOwner {
        treasury = IAction(_treasury);
    }

    function updateSourceApp(address _sourceApp) external onlyOwner {
        SOURCE_APP = abi.encodePacked(_sourceApp);
    }

    function updateSourceChain(uint256 _sourceChainId) external onlyOwner {
        SOURCE_CHAIN = StateMachine.evm(_sourceChainId);
    }
}
