export interface IActionsStatistics {
  totalActions: number;
  maxActions: number;
  totalDisbursed: number;
  reserves: number;
  executedActions: number;
}

export enum ActionType {
  PAYOUT = "PAYOUT",
  BATCH_PAYOUT = "BATCH_PAYOUT",
  STREAM_START = "STREAM_START",
  STREAM_STOP = "STREAM_STOP",
  PAUSE = "PAUSE",
  RESUME = "RESUME"
}

export enum ActionStatus {
  PENDING = "PENDING",
  EXECUTED = "EXECUTED",
  PAUSED = "PAUSED",
  STOPPED = "STOPPED",
}

export const ActionTypes = [
  {
    id: ActionType.PAYOUT,
    label: "Payout",
  },
  {
    id: ActionType.BATCH_PAYOUT,
    label: "Batch Payout",
  },
  {
    id: ActionType.STREAM_START,
    label: "Stream Start",
  },
  {
    id: ActionType.STREAM_STOP,
    label: "Stream Stop",
  },
  {
    id: ActionType.PAUSE,
    label: "Pause"
  },
  {
    id: ActionType.RESUME,
    label: "Resume"
  }
];

export type Byte = `0x${string}`;

export type TMetadata = {
  version: string;
  title: string;
  description: string;
  type: ActionType;
};

export interface IAction {
  actionId: Byte;
  actionType: { id: ActionType; label: string };
  block: number;
  id: string;
  metadata: TMetadata;
  metadataHash: Byte;
  network: "base" | "eth";
  params: Byte;
  recipient: Byte;
  status: ActionStatus;
  timestamp: string;
  totalAmount: string;
  txHash: Byte;
  value: string;
  creator: Byte;
  token: string;
}
export const DUMMY_ACTIONS: IAction[] = [
  {
    actionId: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
    actionType: ActionTypes[0],
    block: 12345678,
    id: "action-1",
    metadata: {
      version: "1.0",
      title: "Q1 Marketing Payout",
      description: "Monthly marketing budget distribution",
      type: ActionType.PAYOUT,
    },
    metadataHash: "0xaabbccddee",
    network: "base",
    params: "0x",
    recipient: "0x742d35Cc6634C0532925a3b844Bc9e7595f42728",
    status: ActionStatus.EXECUTED,
    timestamp: "2024-01-15T10:30:00Z",
    totalAmount: "50000",
    txHash: "0x123abc",
    value: "50000",
    creator: "0x1234567890123456789012345678901234567890",
    token: "USDC",
  },
  {
    actionId: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q",
    actionType: ActionTypes[1],
    block: 12345680,
    id: "action-2",
    metadata: {
      version: "1.0",
      title: "Batch Team Payroll",
      description: "Quarterly team compensation",
      type: ActionType.BATCH_PAYOUT,
    },
    metadataHash: "0xbbccddeeee",
    network: "eth",
    params: "0x",
    recipient: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    status: ActionStatus.PENDING,
    timestamp: "2024-01-20T14:20:00Z",
    totalAmount: "150000",
    txHash: "0x456def",
    value: "150000",
    creator: "0x9876543210987654321098765432109876543210",
    token: "ETH",
  },
  {
    actionId: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r",
    actionType: ActionTypes[2],
    block: 12345682,
    id: "action-3",
    metadata: {
      version: "1.0",
      title: "Revenue Stream Start",
      description: "Monthly revenue distribution stream",
      type: ActionType.STREAM_START,
    },
    metadataHash: "0xccddeeeeee",
    network: "base",
    params: "0x",
    recipient: "0x70997970C51812e339D9B73b0245ad59ba6A7233",
    status: ActionStatus.EXECUTED,
    timestamp: "2024-01-10T08:00:00Z",
    totalAmount: "75000",
    txHash: "0x789ghi",
    value: "75000",
    creator: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    token: "USDC",
  },
  {
    actionId: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s",
    actionType: ActionTypes[4],
    block: 12345684,
    id: "action-4",
    metadata: {
      version: "1.0",
      title: "Pause Dev Fund",
      description: "Temporarily pause development fund disbursement",
      type: ActionType.PAUSE,
    },
    metadataHash: "0xddeeeeeee",
    network: "eth",
    params: "0x",
    recipient: "0x3C44CdDdB6a900c6671B362144b7bEDc94539D8d",
    status: ActionStatus.PAUSED,
    timestamp: "2024-01-18T16:45:00Z",
    totalAmount: "25000",
    txHash: "0xabc123",
    value: "25000",
    creator: "0x0123456789abcdef0123456789abcdef01234567",
    token: "USDC",
  },
  {
    actionId: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    actionType: ActionTypes[5],
    block: 12345686,
    id: "action-5",
    metadata: {
      version: "1.0",
      title: "Resume Operations",
      description: "Resume normal treasury operations",
      type: ActionType.RESUME,
    },
    metadataHash: "0xeeeeeeeeee",
    network: "base",
    params: "0x",
    recipient: "0x1f9840a85d5aF5bf1D1762F925BdaDdC4201F984",
    status: ActionStatus.EXECUTED,
    timestamp: "2024-01-19T09:15:00Z",
    totalAmount: "100000",
    txHash: "0xdef456",
    value: "100000",
    creator: "0xfedcbafedcbafedcbafedcbafedcbafedcbafedcba",
    token: "USDC",
  },
];
