import { network } from "hardhat";
import { encodeActionData, encodeBatchPayoutData } from "../test/utils/codec.js";
import { parseUnits } from "viem";

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

let data = encodeBatchPayoutData(["0x215BA01637F2Bbf91Fcf5Fb4Df6D41bC64820D65"], [parseUnits("50", 18)], "0x123409988")
console.log({ data })

// 0x67ca08b8d49143a6c2b327ef57dad81f53a16edc9e086013505b745c73b092fb