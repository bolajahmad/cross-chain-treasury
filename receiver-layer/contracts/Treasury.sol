// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import "./library/PayoutActions.sol";
import "./library/StreamActions.sol";

contract Treasury is Ownable, AccessControl {
    using PayoutActions for ActionStorage;
    using StreamActions for ActionStorage;

    ActionStorage internal state;

    uint256 private maxActions$;

    uint256 public actionCount;
    uint8 constant MAX_STREAM_CLIFFS = 5;

    // ROLES
    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

    // Stores action records with associated token addresses
    struct ActionData {
        ActionRecord record;
        address token;
    }

    modifier onlyUniqueId(bytes32 _id) {
        require(state.actions[_id].record.status == ActionStatus.INVALID, "Only Unique IDs");
        _;
    }
    modifier onlyValidType(uint8 _id) {
        require(_id <= maxActions$, "Invalid ID");
        _;
    }
    modifier onlyController(address _addr) {
        require(hasRole(CONTROLLER_ROLE, _addr), "Only Controller");
        _;
    }

    event ActionCreated(
        bytes32 indexed id,
        ActionType actionType,
        bytes params
    );
    event TreasuryExecution(
        bytes32 indexed id,
        ActionType actionType
    );

    constructor(uint256 _maxActions) Ownable(msg.sender) {
        maxActions$ = _maxActions;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CONTROLLER_ROLE, msg.sender);
        // Contract deployer shoiuld be the initial controller
        _setRoleAdmin(CONTROLLER_ROLE, DEFAULT_ADMIN_ROLE);
    }

    /**
     * Creates an Action and stores it on-chain
     * This particular function is to be called by the controller, as no fees need to be paid
     *
     * The action's token is automatically set to the controller's address
     *
     * @param _id The action ID of the action to be created, must be Unique
     * @param _type The action type, must exist in ActionType
     * @param _params The ABI encoded parameters for the action
     */
    function createAction(
        bytes32 _id,
        uint8 _type,
        bytes calldata _params
    )
        public
        onlyUniqueId(_id) // Verify that the _id is unique
        onlyValidType(_type) // Type must be greater than 0 & less than maxActions$
        onlyController(msg.sender)
    {
        Action storage action = state.actions[_id];
        action.record.status = ActionStatus.PENDING;
        action.record.actionType = ActionType(_type);
        action.record.data = _params;
        action.record.executedAt = 0;
        action.record.creator = msg.sender;
        action.token = msg.sender;
        actionCount += 1;

        emit ActionCreated(_id, ActionType(_type), _params);
    }

    /**
     * Equivalent to `createAction` but with an additional `_token` parameter
     * Expected to be called by an EOA mostly
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
        // decode the _params to read the action
        (, uint256 _value, , ) = abi.decode(
            _params,
            (address, uint256, address, bytes)
        );
        require(msg.value > 0 || _value > 0, "Value must be > 0");

        if (_token == address(0)) {
            require(msg.value == _value, "ETH value mismatch");
            state.lockedBalances[address(0)] += _value;
        } else {
            require(_value > 0, "Value must be > 0");
            require(
                IERC20(_token).transferFrom(msg.sender, address(this), _value),
                "Unable to transfer ERC20"
            );
            state.lockedBalances[_token] += _value;
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

    function executeTreasuryAction(bytes32 _id) public {
        ActionRecord memory a = state.actions[_id].record;
        require(a.status != ActionStatus.INVALID, "Action does not exist");
        ActionType actionType = a.actionType;

        if (actionType == ActionType.PAYOUT) {
            state.executePayout(_id);
            emit TreasuryExecution(
                _id,
                actionType
            );
        } else if (actionType == ActionType.BATCH_PAYOUT) {
            state.executeBatchPayout(_id);
            emit TreasuryExecution(
                _id,
                actionType
            );
        } else if (actionType == ActionType.STREAM_START) {
           state.executeStreamStart(_id);
            emit TreasuryExecution(
                _id,
                actionType
            );
        } else if (actionType == ActionType.STREAM_STOP) {
            state.executeStreamStop(_id);
            emit TreasuryExecution(
                _id,
                actionType
            );
        } else if (actionType == ActionType.PAUSE) {
            state.executePause(_id);
            emit TreasuryExecution(
                _id,
                actionType
            );
        } else if (actionType == ActionType.RESUME) {
            state.executeResume(_id);
            emit TreasuryExecution(
                _id,
                actionType
            );
        } else {
            revert("Invalid Action Type");
        }
    }

    function maxActions() public view returns (uint256) {
        return maxActions$;
    }

    function action(bytes32 actionId) public view returns (Action memory) {
        return state.actions[actionId];
    }

    function cliffsPaid(bytes32 actionId) public view returns (uint8) {
        return state.cliffsPaid[actionId];
    }

    function lockedBalance(address token) public view returns (uint256) {
        return state.lockedBalances[token];
    }
}
