// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TREASURY_CONTRACT_ADDRESS } from "@/lib/contracts";
import { TreasuryContractABI } from "@/lib/contracts/abis/treasury-contract-abi";
import { ProposalTypes } from "@/lib/models/actions";
import { PaginatedResponse } from "@/lib/models/api";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  createPublicClient,
  formatUnits,
  getContract,
  hexToString,
  http,
} from "viem";
import { baseSepolia } from "viem/chains";
import { squidClient } from "@/lib/squid-client";
import { ACTIONS_QUERY } from "@/lib/queries/actions";
import { decodePayoutActionParameters } from "@/lib/abi-codec";
import { fetchIpfsJson } from "@/lib/queries/fetch-ipfs-data";

type Data = PaginatedResponse<any>;
type RawAction = {
  id: string;
  network: string;
  timestamp: string;
  actionType: number;
  value: string;
  status: string;
  txHash: string;
  params: string;
  block: number;
  actionId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    limit = "10",
    page = "1",
    network,
    id,
    search,
  } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
    id?: string;
    network?: string;
  };

  const where: any = {};
  if (network) where.network = { equals: network };
  if (id) where.id = { equals: id };
  if (search) where.txHash = { contains: search };

  // Read the actions from the graphql API running locally
  const data = await squidClient.request<{ actions: RawAction[] }>(
    ACTIONS_QUERY,
    {
      limit: Number(limit),
      offset: Number(limit) * (Number(page) - 1),
      where,
    }
  );

  // decode the encoded params to fetch actual data and convert the actionType to relevant enum
  const actions = await Promise.all(data.actions.map(async (act) => {
    const { amount, metadata, recipient } = decodePayoutActionParameters(
      act.params as `0x${string}`
    );
    // fetch IPFS data
    const info = await fetchIpfsJson(hexToString(metadata));

    return {
      ...act,
      actionType: ProposalTypes[act.actionType],
      totalAmount: formatUnits(amount, 18),
      recipient,
      metadataHash: metadata,
      metadata: info,
    };
  }));

  console.log({ actions });
  res.status(200).json({
    data: actions,
    meta: {
      total: Number(2),
      hasNext: false,
      pages: 1,
    },
  });
}
