// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ACTIONS_CONTRACT_ADDRESS } from "@/lib/contracts";
import { ActionsContractABI } from "@/lib/contracts/abis/actions-contract-abi";
import { ProposalTypes } from "@/lib/models/actions";
import { PaginatedResponse } from "@/lib/models/api";
import { passetHub } from "@/lib/wallet/wagmi-config";
import type { NextApiRequest, NextApiResponse } from "next";
import { createPublicClient, formatUnits, getContract, http } from "viem";
import { baseSepolia } from "viem/chains";

type Data = PaginatedResponse<any>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const query = req.query as { page?: string; limit?: string; query?: string };

  // setup the smart contract of the treasury using viem
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http("https://base-sepolia.gateway.tenderly.co"),
  });
  const contract = getContract({
    address: ACTIONS_CONTRACT_ADDRESS,
    abi: ActionsContractABI,
    client: { public: publicClient },
  });

  const actionCount = await contract.read.actionCount();
  console.log("Action Count: ", actionCount);

  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const totalPages = Math.ceil(Number(actionCount) / limit);

  if (page > totalPages) {
    res.status(200).json({
      data: [],
      meta: {
        total: Number(actionCount),
        hasNext: false,
        pages: totalPages,
      },
    });
  }

  const actions = [];

  res.status(200).json({
    data: [],
    meta: {
      total: Number(actionCount),
      hasNext: page < totalPages,
      pages: totalPages,
    },
  });
}
