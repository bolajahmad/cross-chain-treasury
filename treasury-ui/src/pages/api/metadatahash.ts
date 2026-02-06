// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { create } from "@storacha/client";
import { Signer } from "@storacha/client/principal/ed25519";
import { StoreMemory } from "@storacha/client/stores/memory";
import * as Proof from "@storacha/client/proof";
import { StorachaDelegationProof, StorachaKey } from "@/lib/constants";

type Data = {
  hash: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const body = JSON.parse(req.body);

  // Load client with my private key
  const principal = Signer.parse(StorachaKey);
  const store = new StoreMemory();
  const client = await create({ principal, store });

  // Bring in the proof
  const proof = await Proof.parse(StorachaDelegationProof);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());

  const metadata = JSON.stringify({
    version: body.version,
    title: body.title,
    description: body.description,
    type: body.type,
  });
  const file = new File([metadata], `${body.title}`, {
    type: "application/json",
  });
  const cid = await client.uploadFile(file);

  res.status(200).json({ hash: cid.toString() });
}
