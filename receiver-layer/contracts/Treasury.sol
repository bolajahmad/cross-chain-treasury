// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/ITreasuryController.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

contract Treasury is Ownable, AccessControl {
    uint256 private maxActions$;

    uint256 public actionCount;
    uint256 public MAX_STREAM_CLIFFS = 5;

    // ROLES
    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

    // Stores action records with associated token addresses
    struct ActionData {
        ActionRecord record;
        address token;
    }

    // bytes32 represents the actionID
    mapping(bytes32 => ActionData) public actions;
    mapping(address => uint256) public lockedBalances;

    mapping(bytes32 => uint8) private streams;

    modifier onlyUniqueId(bytes32 _id) {
        require(!actions[_id].record.exists, "Only Unique IDs");
        _;
    }
    modifier onlyValidType(uint8 _id) {
        require(_id > 0 && _id <= maxActions$, "Invalid ID");
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
        ActionType actionType,
        uint256 amount,
        bytes params
    );

    constructor(uint256 _maxActions) Ownable(msg.sender) {
        maxActions$ = _maxActions;
        // Contract deployer shoiuld be the initial controller
        _setRoleAdmin(CONTROLLER_ROLE, DEFAULT_ADMIN_ROLE);
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(CONTROLLER_ROLE, msg.sender);
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
        ActionRecord memory record = ActionRecord({
            status: ActionStatus.PENDING,
            actionType: ActionType(_type - 1),
            exists: true,
            dataHash: _params,
            executedAt: 0
        });
        actions[_id].record = record;
        actions[_id].token = msg.sender;

        actionCount += 1;

        emit ActionCreated(_id, record.actionType, _params);
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
            lockedBalances[address(0)] += _value;
        } else {
            require(_value > 0, "Value must be > 0");
            require(
                IERC20(_token).transferFrom(msg.sender, address(this), _value)
            );
            lockedBalances[_token] += _value;
        }

        ActionRecord memory record = ActionRecord({
            status: ActionStatus.PENDING,
            actionType: ActionType(_type - 1),
            exists: true,
            dataHash: _params,
            executedAt: 0
        });
        actions[_id].record = record;
        actions[_id].token = _token;

        actionCount += 1;

        emit ActionCreated(_id, record.actionType, _params);
    }

    function executeTreasuryAction(bytes32 _id) public {
        ActionRecord memory action = actions[_id].record;
        require(action.exists, "Action does not exist");
        ActionType actionType = action.actionType;

        if (actionType == ActionType.PAYOUT) {
            (address recipient, uint256 amount, address _token, ) = abi.decode(
                action.dataHash,
                (address, uint256, address, bytes)
            );

            if (_token == address(0)) {
                // Once PAYOUT is done, delete the record
                delete actions[_id];
                require(
                    lockedBalances[address(0)] >= amount,
                    "Insufficient locked ETH"
                );
                lockedBalances[address(0)] -= amount;

                // Transfer specified amount to the recipient
                (bool sent, ) = payable(recipient).call{value: amount}("");
                require(sent, "Failed to send native tokens");

                action.status = ActionStatus.EXECUTED;
                action.executedAt = block.timestamp;

                emit TreasuryExecution(
                    _id,
                    actionType,
                    amount,
                    action.dataHash
                );
            }
        } else if (actionType == ActionType.BATCH_PAYOUT) {
            Payout[] memory payouts = abi.decode(action.dataHash, (Payout[]));
            // Length should not exceed 50
            require(payouts.length <= 50, "Exceeds max batch size");
            // Get the total amount to be paid
            uint256 totalAmount = 0;
            for (uint256 i = 0; i < payouts.length; i++) {
                totalAmount += payouts[i].amount;
            }
            // ensure there's enough balance to pay
            require(
                address(this).balance >= totalAmount,
                "Insufficient Balance"
            );

            // Lenght is within limit and enough funds to pay
            for (uint256 i = 0; i < payouts.length; i++) {
                (bool sent, ) = payable(payouts[i].recipient).call{
                    value: payouts[i].amount
                }("");
                require(sent, "Failed to send Ether");
            }
            // Once BATCH_PAYOUT is done, delete the record
            delete actions[_id];
            action.status = ActionStatus.EXECUTED;
            action.executedAt = block.timestamp;
            emit TreasuryExecution(
                _id,
                actionType,
                totalAmount,
                action.dataHash
            );
        } else if (actionType == ActionType.STREAM_START) {
            // decode the parameters
            (
                address _recipient,
                uint256 _amount,
                uint64 _startTime,
                uint64 _cliff,
                address _token
            ) = abi.decode(
                    action.dataHash,
                    (address, uint256, uint64, uint64, address)
                );
            require(_cliff > 0, "Invalid Cliff");
            // Ensure deadline has passed
            require(block.timestamp >= _startTime, "Stream not started!");

            uint8 cliffPaid = streams[_id];
            require(cliffPaid <= MAX_STREAM_CLIFFS, "Max streams reached");

            uint256 cliffsUnlocked = (block.timestamp - _startTime) / _cliff;
            if (cliffsUnlocked > MAX_STREAM_CLIFFS) {
                cliffsUnlocked = uint256(MAX_STREAM_CLIFFS);
            }
            require(cliffsUnlocked > cliffPaid, "No new cliffs unlocked");

            uint256 amountPerCliff = _amount / MAX_STREAM_CLIFFS;
            uint256 cliffsToPay = cliffsUnlocked - cliffPaid;
            uint256 amountToPay = cliffsToPay * amountPerCliff;

            streams[_id] = uint8(cliffsUnlocked);
            require(lockedBalances[_token] >= amountToPay, "Insufficient locked funds");
            lockedBalances[_token] -= amountToPay;

            // actually release the due funds
            if (_token == address(0)) {
                // Transfer native tokens
                (bool sent, ) = payable(_recipient).call{value: amountToPay}("");
                require(sent, "Token transfer failed");
            } else {
                require(
                    IERC20(_token).transfer(_recipient, amountToPay),
                    "Token transfer failed"
                );
            }

            // Finalise state updates
            if (cliffsUnlocked == MAX_STREAM_CLIFFS)  {
                action.status = ActionStatus.EXECUTED;
                action.executedAt = block.timestamp;
                delete streams[_id];
                delete actions[_id];
            }
            
            emit TreasuryExecution(
                _id,
                ActionType.STREAM_START,
                amountToPay,
                action.dataHash
            );
        } else {
            revert("Invalid Action Type");
        }
    }

    function generateActionId() public view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, actionCount)
            );
    }

    function maxActions() public view returns (uint256) {
        return maxActions$;
    }
}
