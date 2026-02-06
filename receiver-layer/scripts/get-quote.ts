import { network } from "hardhat";
import {
  encodeActionData,
  encodeBatchPayoutData,
  encodeStreamStartData,
} from "../test/utils/codec.js";
import { parseUnits, zeroAddress } from "viem";

const { viem } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

console.log("Sending transaction using the OP chain type");

const publicClient = await viem.getPublicClient();
const [senderClient] = await viem.getWalletClients();

console.log("Sending 1 wei from", senderClient.account.address, "to itself");

const l1Gas = await publicClient.estimateL1Gas({
  account: senderClient.account.address,
  to: senderClient.account.address,
  value: 1n,
});

console.log("Estimated L1 gas:", l1Gas);

console.log("Sending L2 transaction");
const tx = await senderClient.sendTransaction({
  to: senderClient.account.address,
  value: 1n,
});

await publicClient.waitForTransactionReceipt({ hash: tx });

console.log("Transaction sent successfully");

let data = encodeBatchPayoutData(
  ["0x215BA01637F2Bbf91Fcf5Fb4Df6D41bC64820D65"],
  [parseUnits("75", 18)],
  zeroAddress, // Start time, 3 minutes from now
  "0x8768488400", // cliff duration, 5 minutes
);
// console.log({
//   startTime: BigInt(Math.floor(Date.now() / 1000) + 3 * 60),
//   cliff: BigInt(5 * 60)
// });
console.log({ data });
