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
  PENDING,
  EXECUTED,
  PAUSED,
  FAILED
}

export const ProposalTypes = [
  {
    id: ProposalType.PAYOUT,
    label: "Payout"
  },
  {
    id: ProposalType.BATCH_PAYOUT,
    label: "Batch Payout"
  },
  {
    id: ProposalType.STREAM_START,
    label: "Stream Start"
  },
  {
    id: ProposalType.STREAM_STOP,
    label: "Stream Stop"
  },
]