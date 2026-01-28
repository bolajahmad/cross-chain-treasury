// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

/**
 * #[derive(scale::Encode, scale::Decode)]
pub enum TreasuryAction {
    Payout { recipient: AccountId, amount: Balance, token: u32, metadata: string},
    BatchPayout { payments: Vec<Payout> },
    StreamStart { recipient: AccountId, amount: Balance, duration: u64, cliff: u64 },
    StreamStop { stream_id: u32 },

    CreateBounty { id: u32, reward: Balance, metadata: Vec<u8> },
    ApproveBounty { id: u32, recipient: AccountId },

    SweepToStrategy { strategy_id: u32, amount: Balance },
    Rebalance { allocations: Vec<(u32, Balance)> },

    SetBudget { amount: Balance },
    Pause,
    Resume,
    EmergencyWithdraw { to: AccountId },
}

 */
/* Treasury actions are defined using an actionID and the SCALE-encoded data */
// Actions are listed below
// PAYOUT = 0x01 (Payout to a specified address) (address,uint256,uint32)
// BATCH_PAYOUT = 0x02 (Batch payout to multiple addresses) (address,uint256,uint32)[]
// STREAM_START = 0x03 (Start a stream to a specified address) (address,uint256,uint64,uint32)
// STREAM_STOP = 0x04 (Stop a stream to a specified address) (address, uint32)

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

interface IAction {
    function createAction(
        bytes32 _id,
        uint8 _type,
        bytes calldata _params
    ) external;

    function maxActions() external view returns (uint256);

    function action(bytes32 actionId) external view returns (Action memory);

    function lockedBalance(address token) external view returns (uint256);

    function cliffsPaid(bytes32 actionId) external view returns (uint8);

    function makePayout(
        address token,
        bytes32 id,
        address recipient,
        uint256 amount
    ) external;

    function finalizeAction(bytes32 _id) external;

    function updateStatus(bytes32 _id, ActionStatus _status) external;
}

interface IExecutor {
    function execute(address treasury, bytes32 id) external;
}
