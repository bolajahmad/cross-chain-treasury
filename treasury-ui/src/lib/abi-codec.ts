import { encodeAbiParameters } from "viem"

type Byte = `0x${string}`
export const encodePayoutActionParameters = (recipient: Byte, amount: bigint, token: Byte, metadata: Byte) => {
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
                ]
            }
        ],
        [
            {
                recipient,
                amount,
                token,
                metadata
            }
        ]
    )

    return encoded;
}