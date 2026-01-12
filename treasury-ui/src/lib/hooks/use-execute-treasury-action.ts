import { useWriteContract } from "wagmi";
import { TreasuryContractABI } from "../contracts/abis/treasury-contract-abi";
import { TREASURY_CONTRACT_ADDRESS } from "../contracts";
import { useMutation } from "@tanstack/react-query";
import { ProposalType, ProposalTypes } from "../models/actions";
import { hash256Message } from "../helper";
import {
  encodeBatchPayoutActionParameters,
  encodePayoutActionParameters,
  encodeStreamStartActionParameters,
} from "../abi-codec";
import { encodeAbiParameters, stringToHex, zeroAddress } from "viem";
import { useState } from "react";

type PayoutParams = {
  recipient: `0x${string}`;
  amount: bigint;
  token: `0x${string}`;
  metadata?: string;
};
type BatchPayoutParams = {
  recipients: `0x${string}`[];
  amounts: bigint[];
  token: `0x${string}`;
  metadata?: string;
};
type StreamStartParams = {
  recipient: `0x${string}`;
  amount: string;
  token: `0x${string}`;
  startTime: string;
  cliff: string;
  metadata?: string;
};
export type MetadataHash = {
  title: string;
  description: string;
  type: ProposalType;
};

export function useCreateTreasuryActions() {
  const [isSubmitting, setSubmitting] = useState(false);
  const { mutateAsync, isError, isSuccess, reset } = useWriteContract();
  const { mutateAsync: uploadMetadata } = useMutation({
    mutationKey: ["upload-metadata-hash"],
    mutationFn: (data: MetadataHash) =>
      fetch("/api/metadatahash", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          type: data.type,
          version: "1.0.0",
        }),
      }).then((res) => res.json()),
  });

  const createPayoutAction = async (
    metadata: MetadataHash,
    params: PayoutParams
  ) => {
    setSubmitting(true);
    // push the proposal metadata to IPFS to get the metadataURI
    const metadataHash = await uploadMetadata(metadata);
    params["metadata"] = metadataHash.hash;
    const actionId = await hash256Message(metadataHash.hash);
    console.log({ actionId });
    const paramsHash = encodePayoutActionParameters(
      params.recipient,
      params.amount,
      zeroAddress, // TODO: should be token address
      stringToHex(metadataHash.hash)
    );
    console.log({ paramsHash });

    try {
      await mutateAsync({
        abi: TreasuryContractABI,
        address: TREASURY_CONTRACT_ADDRESS,
        functionName: "createAction",
        args: [`0x${actionId}`, 0, paramsHash],
      });
    } catch (error) {
      console.error(error);
      console.log({ error });
    } finally {
      setSubmitting(false);
    }
  };

  const createBatchPayoutAction = async (
    metadata: MetadataHash,
    params: BatchPayoutParams
  ) => {
    // Generate the actionID
    setSubmitting(true);
    const metadataHash = await uploadMetadata(metadata);
    const actionId = await hash256Message(metadataHash.hash);
    console.log({ actionId });
    params["metadata"] = metadataHash.hash;

    const paramsHash = encodeBatchPayoutActionParameters(
      params.recipients,
      params.amounts,
      zeroAddress,
      stringToHex(metadataHash.hash)
    );
    console.log({ paramsHash });

    try {
      await mutateAsync({
        abi: TreasuryContractABI,
        address: TREASURY_CONTRACT_ADDRESS,
        functionName: "createAction",
        args: [`0x${actionId}`, 1, paramsHash],
      });
    } catch (error) {
      console.error(error);
      console.log({ error });
    } finally {
      setSubmitting(false);
    }
  };

  const createStreamStartAction = async (
    metadata: MetadataHash,
    params: StreamStartParams
  ) => {
    setSubmitting(true);
    // push the proposal metadata to IPFS to get the metadataURI
    const metadataHash = await uploadMetadata(metadata);
    params["metadata"] = metadataHash.hash;
    const actionId = await hash256Message(metadataHash.hash);
    console.log({ actionId });

    const paramsHash = encodeStreamStartActionParameters(
      params.recipient,
      BigInt(params.amount),
      BigInt(params.startTime),
      BigInt(params.cliff),
      zeroAddress,
      stringToHex(metadataHash.hash)
    );
    console.log({ paramsHash });

    try {
      await mutateAsync({
        abi: TreasuryContractABI,
        address: TREASURY_CONTRACT_ADDRESS,
        functionName: "createAction",
        args: [`0x${actionId}`, 2, paramsHash],
      });
    } catch (error) {
      console.error(error);
      console.log({ error });
    } finally {
      setSubmitting(false);
    }
  };

  const createStreamPauseResumeStopAction = async (
    metadata: MetadataHash,
    id: `0x${string}`,
    actionType: ProposalType
  ) => {
    setSubmitting(true);
    // push the proposal metadata to IPFS to get the metadataURI
    const metadataHash = await uploadMetadata(metadata);
    const actionId = await hash256Message(metadataHash.hash);
    console.log({ actionId });

    const paramsHash = encodeAbiParameters(
      [
        {
          name: "payout",
          type: "tuple",
          components: [{ name: "actionId", type: "bytes32" }],
        },
      ],
      [
        {
          actionId: id,
        },
      ]
    );

    const index = ProposalTypes.findIndex((p) => p.id === actionType);
    try {
      await mutateAsync({
        abi: TreasuryContractABI,
        address: TREASURY_CONTRACT_ADDRESS,
        functionName: "createAction",
        args: [`0x${actionId}`, index, paramsHash],
      });
    } catch (error) {
      console.error(error);
      console.log({ error });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    createPayoutAction,
    createBatchPayoutAction,
    createStreamStartAction,
    createStreamPauseResumeStopAction,
    isSubmitting,
    isSuccessful: isSuccess,
    isFailed: isError,
    reset,
  };
}
