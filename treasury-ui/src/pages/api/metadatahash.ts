// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { create } from "@storacha/client";

type Data = {
  hash: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = JSON.parse(req.body);
  const client = await create();
  const account = await client.login("bjahmad4tech@gmail.com");
  await account.plan.wait();

  await client.setCurrentSpace(
    "did:key:z6MkrSwMW4WeF6K39YCsSkvWavFmrXhsf3TCxa4o3yXkJJoG"
  );

  const metadata = JSON.stringify({
    version: body.version,
    title: body.title,
    description: body.description,
    type: body.type,
  });
  const file = new File([metadata], `${body.title}`, { type: "application/json" });
  const cid = await client.uploadFile(file);

  res.status(200).json({ hash: cid.toString() });
}
