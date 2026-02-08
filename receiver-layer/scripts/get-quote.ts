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
  ["0x215BA01637F2Bbf91Fcf5Fb4Df6D41bC64820D65", "0xc80211D0a75dd550e54Ea8FE6Eb71a70971269b8"],
  [parseUnits("5", 18), parseUnits("10", 18)],
  "0x71783985665e28d1bb95ef75c4c6b480ccad4a96b102c5f272cc2a23f2b7c993", // Start time, 3 minutes from now
  "0xFa0DD45434E310daC6932b92A1B78fFD0Ed19285", // cliff duration, 5 minutes
);

console.log({ data });
