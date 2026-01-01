import { useWriteContract } from "wagmi"
import { TreasuryContractABI } from "../contracts/abis/treasury-contract-abi";
import { TREASURY_CONTRACT_ADDRESS } from "../contracts";
import { useMutation } from "@tanstack/react-query";
import { ProposalType } from "../models/actions";
import { hash256Message } from "../helper";
import { encodePayoutActionParameters } from "../abi-codec";
import { stringToHex, zeroAddress } from "viem";

type PayoutParams = { recipient: `0x${string}`; amount: bigint, token: `0x${string}`, metadata?: string };
type MetadataHash = { title: string; description: string; type: ProposalType };
export function useCreateTreasuryActions() {
    const { mutateAsync } = useWriteContract();
    const { mutateAsync: uploadMetadata } = useMutation({
        mutationKey: ["upload-metadata-hash"],
        mutationFn: (data: MetadataHash) => fetch("/api/metadatahash", {
            method: "POST",
            body: JSON.stringify({
                title: data.title,
                description: data.description,
                type: data.type,
                version: "1.0.0"
            })
        }).then(res => res.json())
    })

    const createPayoutAction = async (metadata: MetadataHash, params: PayoutParams) => {
        // push the proposal metadata to IPFS to get the metadataURI
        const metadataHash = await uploadMetadata(metadata);
        params["metadata"] = metadataHash.hash;
        const actionId = await hash256Message(metadataHash.hash);
        console.log({ actionId });
        const paramsHash = encodePayoutActionParameters(
            params.recipient,
            params.amount, 
            zeroAddress, // TODO: should be token address
            stringToHex(metadataHash.hash),
        );
        console.log({ paramsHash });

        try {
            await mutateAsync({
                abi: TreasuryContractABI,
                address: TREASURY_CONTRACT_ADDRESS,
                functionName: "createAction",
                args: [
                    `0x${actionId}`,
                    1,
                    paramsHash
                ]
            });
        } catch (error) {
            console.error(error);
            console.log({ error })
        }
    };

    return {
        createPayoutAction
    }
}