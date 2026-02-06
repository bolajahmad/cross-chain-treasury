// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ACTIONS_CONTRACT_ADDRESS, ACTIONS_CONTROLLER_CONTRACT_ADDRESS, TOKEN_RECEIVER_CONTRACT_ADDRESS } from "@/lib/contracts";
import { ActionsContractABI } from "@/lib/contracts/abis/actions-contract-abi";
import { ActionsControllerABI } from "@/lib/contracts/abis/actions-controller-abi";
import { TokenReceiverContractABI } from "@/lib/contracts/abis/token-receiver-abi";
import { ProposalTypes } from "@/lib/models/actions";
import { PaginatedResponse } from "@/lib/models/api";
import { TContractData } from "@/lib/models/contracts";
import { passetHub } from "@/lib/wallet/wagmi-config";
import type { NextApiRequest, NextApiResponse } from "next";
import { createPublicClient, formatUnits, getContract, http } from "viem";
import { baseSepolia, sepolia } from "viem/chains";

type Data = TContractData[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    // Process a GET request
    const contracts: Data = [
        {
            id: "actions",
            address: ACTIONS_CONTRACT_ADDRESS,
            name: "Actions",
            networkId: baseSepolia.id,
            abi: JSON.stringify(ActionsContractABI),
        },
        {
            address: ACTIONS_CONTROLLER_CONTRACT_ADDRESS,
            name: "Actions Controller",
            id: "controller",
            networkId: baseSepolia.id,
            abi: JSON.stringify(ActionsControllerABI)
        },
        {
            address: TOKEN_RECEIVER_CONTRACT_ADDRESS,
            name: "Token Receiver",
            id: "receiver",
            networkId: sepolia.id,
            abi: JSON.stringify(TokenReceiverContractABI)
        }
    ]

    res.status(200).json(contracts)
  } 
}
