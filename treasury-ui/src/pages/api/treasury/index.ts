// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TREASURY_CONTRACT_ADDRESS } from "@/lib/contracts";
import { TreasuryContractABI } from "@/lib/contracts/abis/treasury-contract-abi";
import { PaginatedResponse } from "@/lib/models/api";
import { passetHub } from "@/lib/wallet/wagmi-config";
import type { NextApiRequest, NextApiResponse } from "next";
import { createPublicClient, formatUnits, getContract, http } from "viem";

type Data = PaginatedResponse<any>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query = req.query as { page?: string; limit?: string; query?: string };
  
  // setup the smart contract of the treasury using viem
  const publicClient = createPublicClient({
    chain: passetHub,
    transport: http(),
  });
  const contract = getContract({
    address: TREASURY_CONTRACT_ADDRESS,
    abi: TreasuryContractABI,
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
        pages: totalPages
      } 
     });
  }

  const actions = [];
  const data = await contract.read.actions(["0xca99f86632e4d9f1f3987bfa130bcd14ef36bcdb2e45b9c4381ce63461f6572a"]);
  actions.push(data)

  console.log("Fetched actions: ", actions);
  res.status(200).json({ 
    data: actions,
    meta: {
      total: Number(actionCount),
      hasNext: page < totalPages,
      pages: totalPages
    }
   });
}
