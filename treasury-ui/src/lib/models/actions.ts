export interface IActionsStatistics {
  totalActions: number;
  maxActions: number;
  totalDisbursed: number;
  reserves: number;
  executedActions: number;
}

export enum ProposalType {
  PAYOUT = "PAYOUT",
  BATCH_PAYOUT = "BATCH_PAYOUT",
  STREAM_START = "STREAM_START",
  STREAM_STOP = "STREAM_STOP",
}

export enum ActionStatus {
  PENDING = "PENDING",
  EXECUTED = "EXECUTED",
  PAUSED = "PAUSED",
  FAILED = "FAILED",
}

export const ProposalTypes = [
  {
    id: ProposalType.PAYOUT,
    label: "Payout",
  },
  {
    id: ProposalType.BATCH_PAYOUT,
    label: "Batch Payout",
  },
  {
    id: ProposalType.STREAM_START,
    label: "Stream Start",
  },
  {
    id: ProposalType.STREAM_STOP,
    label: "Stream Stop",
  },
];

export type Byte = `0x${string}`;

export type TMetadata = {
  version: string;
  title: string;
  description: string;
  type: ProposalType;
};

export interface IAction {
  actionId: Byte;
  actionType: { id: ProposalType; label: string };
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
}
