// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { IController } from "./interfaces/ITreasuryController.sol";
import "./interfaces/IActions.sol";

contract ActionsContract is IAction, Ownable, AccessControl {
    ActionStorage internal state;

    uint256 private maxActions$;
    mapping(ActionType => address) private executors;

    uint256 public actionCount;
    uint8 constant MAX_STREAM_CLIFFS = 5;

    // ROLES
    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    // Stores action records with associated token addresses
    struct ActionData {
        ActionRecord record;
        address token;
    }

    modifier onlyUniqueId(bytes32 _id) {
        require(
            state.actions[_id].record.status == ActionStatus.INVALID,
            "Only Unique IDs"
        );
        _;
    }
    modifier onlyValidType(uint8 _id) {
        require(_id <= maxActions$, "Invalid ID");
        _;
    }

    modifier onlyExecutor() {
        require(hasRole(EXECUTOR_ROLE, msg.sender), "Only Executor");
        _;
    }

    event ActionCreated(
        bytes32 indexed id,
        ActionType actionType,
        bytes params
    );
    event TreasuryExecution(bytes32 indexed id, ActionType actionType);
    event PayoutCompleted(bytes32 indexed id, address recipient, uint256 amount);
    event ActionFinalized(bytes32 indexed id);

    constructor(uint256 _maxActions) Ownable(msg.sender) {
        maxActions$ = _maxActions;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CONTROLLER_ROLE, msg.sender);
        _grantRole(EXECUTOR_ROLE, msg.sender);
        // Contract deployer should be the initial controller
        _setRoleAdmin(CONTROLLER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(EXECUTOR_ROLE, DEFAULT_ADMIN_ROLE);
    }

    /**
     * Creates an Action and stores it on-chain
     * This particular function is to be called by the controller, as no fees need to be paid
     * The controller contract must be registered with the Actions contract
     * 
     * Ensures that only authorized controllers can create actions.
     * The action's token is automatically set to the controller's address (signifies Cross-chain actions).
     *
     * @param _id The action ID of the action to be created, must be Unique
     * @param _type The action type, must exist in ActionType
     * @param _params The ABI encoded parameters for the action
     * 
     * Events - `ActionCreated` event upon successful creation of the action.
     */
    function createAction(
        bytes32 _id,
        uint8 _type,
        bytes calldata _params
    )
        public
        onlyUniqueId(_id) // Verify that the _id is unique
        onlyValidType(_type) // Type must be greater than 0 & less than maxActions$
    {
        require(hasRole(CONTROLLER_ROLE, msg.sender), "Only Controller");
        if (!(executors[ActionType(_type)] != address(0))) revert UnauthorizedExecutor();

        Action storage _action = state.actions[_id];
        _action.record.status = ActionStatus.PENDING;
        _action.record.actionType = ActionType(_type);
        _action.record.data = _params;
        _action.record.executedAt = 0;
        _action.record.creator = msg.sender;
        _action.token = msg.sender;
        actionCount += 1;

        emit ActionCreated(_id, ActionType(_type), _params);
    }

    /**
     * Equivalent to `createAction` but with an additional `_token` parameter
     * Expected to be called by an EOA mostly.
     * 
     * It's expected that user has granted approval to spend the specified `_token` amount.
     * This will be decoded from the `_params` based on the action type.
     * This call will transfer the specified token amount from the caller to this contract.
     *
     * @param _id The action ID of the action to be created, must be Unique
     * @param _type The action type, must exist in ActionType
     * @param _params The ABI-encoded parameters for the action
     * @param _token The ERC20 token address associated with the action.
     *
     * _token can be address(0) for native ETH actions.
     */
    function createAction(
        bytes32 _id,
        uint8 _type,
        bytes calldata _params,
        address _token
    ) public payable onlyUniqueId(_id) onlyValidType(_type) {
        if (executors[ActionType(_type)] == address(0)) revert UnauthorizedExecutor();
        require(!hasRole(CONTROLLER_ROLE, _token), "Cannot be a controller");

        // decode the _params to read the action
        (, uint256 _value) = decodedParams(_type, _params);

        if (
            _type != uint8(ActionType.PAUSE) &&
            _type != uint8(ActionType.RESUME) &&
            _type != uint8(ActionType.STREAM_STOP)
        ) {
            if (_value == 0 && msg.value == 0) revert InsufficientFunds();

            if (_token == address(0)) {
                if (msg.value < _value) revert InsufficientFunds();
                state.lockedBalances[address(0)] += msg.value;
            } else {
                require(
                    IERC20(_token).transferFrom(
                        msg.sender,
                        address(this),
                        _value
                    ),
                    "Unable to transfer ERC20"
                );
                state.lockedBalances[_token] += _value;
            }
        }

        Action storage _action = state.actions[_id];
        _action.record.status = ActionStatus.PENDING;
        _action.record.actionType = ActionType(_type);
        _action.record.data = _params;
        _action.record.executedAt = 0;
        _action.record.creator = msg.sender;
        _action.token = _token;

        actionCount += 1;

        emit ActionCreated(_id, ActionType(_type), _params);
    }

    function executeAction(bytes32 _id) public {
        ActionRecord memory a = state.actions[_id].record;
        if (a.status == ActionStatus.INVALID) revert InvalidAction();

        ActionType actionType = a.actionType;
        if (executors[actionType] == address(0)) {
            revert UnauthorizedExecutor();
        }

        IExecutor(executors[actionType]).execute(address(this), _id);
        emit TreasuryExecution(_id, actionType);
    }

    function makePayout(
        address token,
        bytes32 id,
        address recipient,
        uint256 amount
    ) external onlyExecutor {
        if (token == address(0)) {
            (bool sent, ) = payable(recipient).call{value: amount}("");
            require(sent, "Transfer failed");
        } else if (hasRole(CONTROLLER_ROLE, token)) {
            ActionRecord memory _record = state.actions[id].record;
            bytes memory params = abi.encode(
                _record.data,
                recipient,
                amount,
                _record.actionType
            );
            require(
                IController(token).relayExecutionResult(params),
                "Execution not sent!"
            );
        } else {
            require(
                IERC20(token).transfer(recipient, amount),
                "Transfer failed"
            );
        }

        state.lockedBalances[token] -= amount;
        if (state.actions[id].record.actionType == ActionType.STREAM_START) {
            state.cliffsPaid[id] += amount;
        }
        
        emit PayoutCompleted(id, recipient, amount);
    }

    function finalizeAction(bytes32 _id) external onlyExecutor {
        ActionType actionType = state.actions[_id].record.actionType;
        if (actionType == ActionType.STREAM_START) {
            delete state.cliffsPaid[_id];
        }
        delete state.actions[_id];
        emit ActionFinalized(_id);
    }

    function updateStatus(bytes32 _id, ActionStatus _status) external onlyExecutor {
        ActionRecord storage record = state.actions[_id].record;
        record.status = _status;
    }

    function maxActions() public view returns (uint256) {
        return maxActions$;
    }

    function action(bytes32 actionId) public view returns (Action memory) {
        return state.actions[actionId];
    }

    function cliffsPaid(bytes32 actionId) public view returns (uint256) {
        return state.cliffsPaid[actionId];
    }

    function lockedBalance(address token) public view returns (uint256) {
        return state.lockedBalances[token];
    }

    function setExecutor(
        uint8 _type,
        address _executor
    ) external {
        require(hasRole(EXECUTOR_ROLE, msg.sender), "Only Executor");
        require(_executor.code.length > 0, "Not a contract");
        require(executors[ActionType(_type)] == address(0), "Already set");
        executors[ActionType(_type)] = _executor;
        _grantRole(EXECUTOR_ROLE, _executor);
    }

    function decodedParams(
        uint8 _type,
        bytes memory _action
    ) internal pure returns (address, uint256) {
        if (_type == uint8(ActionType.PAYOUT)) {
            (address recipient, uint256 _amount,) = abi.decode(
                _action,
                (address, uint256, bytes)
            );
            return (recipient, _amount);
        } else if (_type == uint8(ActionType.BATCH_PAYOUT)) {
            (address[] memory recipients, uint256[] memory _amounts,) = abi
                .decode(_action, (address[], uint256[], bytes));
            uint256 totalAmount = 0;
            for (uint256 i = 0; i < _amounts.length; i++) {
                totalAmount += _amounts[i];
            }
            return (recipients[0], totalAmount);
        } else if (_type == uint8(ActionType.STREAM_START)) {
            (address recipient, uint256 _amount, , ) = abi.decode(
                _action,
                (address, uint256, uint64, uint64)
            );
            return (recipient, _amount);
        } else {
            return (address(0), 0);
        }
    }
}
