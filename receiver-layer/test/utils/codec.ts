import { encode } from "node:punycode";
import { encodeAbiParameters, zeroAddress } from "viem";

export const encodeReceiverData = (actionType: number, action: `0x${string}`, recipient: `0x${string}`, amount: bigint) => {
  return encodeAbiParameters(
        [
          { type: "bytes" },
          { type: "address" },
          { type: "uint256" },
          { type: "uint8" },
        ],
        [action, recipient, amount, actionType],
      );
}

export const encodeActionData = (recipient: `0x${string}`, amount: bigint, metadata: `0x${string}`, token: `0x${string}` = zeroAddress) => {
    return encodeAbiParameters(
        [
            { type: "address" },
            { type: "uint256" },
            { type: "address" },
            { type: "bytes" }
        ],
        [recipient, amount, token, metadata]
    )
}

export const encodeBatchPayoutData = (recipients: `0x${string}`[], amounts: bigint[], metadata: `0x${string}`, token: `0x${string}` = zeroAddress) => {
    return encodeAbiParameters(
        [
            { type: "address[]" },
            { type: "uint256[]" },
            { type: "address" },
            { type: "bytes" }
        ],
        [recipients, amounts, token, metadata]
    )
}

export const encodeStreamStartData = (recipient: `0x${string}`, amount: bigint, startTime: bigint, cliff: bigint) => {
    return encodeAbiParameters(
        [
            { type: "address" },
            { type: "uint256" },
            { type: "uint64" },
            { type: "uint64" }
        ],
        [recipient, amount, startTime, cliff]
    )
}

export const encodeControllerAcceptData = (actionType: number, amount: bigint, action: `0x${string}`) => {
    return encodeAbiParameters(
        [
            { type: "uint8" },
            { type: "uint256" },
            { type: "bytes" },
        ], [actionType, amount, action]
    )
}