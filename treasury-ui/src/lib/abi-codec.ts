import { encodeAbiParameters, decodeAbiParameters } from "viem";

type Byte = `0x${string}`;
export const encodePayoutActionParameters = (
  recipient: Byte,
  amount: bigint,
  token: Byte,
  metadata: Byte
) => {
  const encoded = encodeAbiParameters(
    [
      {
        name: "payout",
        type: "tuple",
        components: [
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "token", type: "address" },
          { name: "metadata", type: "bytes" },
        ],
      },
    ],
    [
      {
        recipient,
        amount,
        token,
        metadata,
      },
    ]
  );

  return encoded;
};

export const decodePayoutActionParameters = (encoded: Byte) => {
  const decoded = decodeAbiParameters(
    [
      {
        name: "payout",
        type: "tuple",
        components: [
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "token", type: "address" },
          { name: "metadata", type: "bytes" },
        ],
      },
    ],
    encoded
  );

  const payout = decoded[0] as {
    recipient: Byte;
    amount: bigint;
    token: Byte;
    metadata: Byte;
  };

  return payout;
};
