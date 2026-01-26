// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

enum ActionType {
    PAYOUT,
    BATCH_PAYOUT,
    STREAM_START,
    STREAM_STOP,
    PAUSE,
    RESUME
}

enum ActionStatus {
    INVALID,
    PENDING,
    EXECUTED,
    PAUSED,
    STOPPED
}

struct ActionRecord {
    ActionStatus status;
    ActionType actionType;
    address creator;
    bytes data;
    uint256 executedAt; // initiator of the stream
}

struct Action {
    ActionRecord record;
    address token;
}

struct ActionStorage {
    // Mapping of (ction ID => Action)
    mapping(bytes32 => Action) actions;
    // Mapping of the aamount of times a STREAM action has been executed
    mapping(bytes32 => uint8) cliffsPaid;
    // Mapping of the (token address => amount) of tokens locked in active streams
    mapping(address => uint256) lockedBalances;
}