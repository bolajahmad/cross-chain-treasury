import { network } from "hardhat";
import { parseUnits } from "viem";

const { viem } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

console.log("Sending transaction using the OP chain type");

const publicClient = await viem.getPublicClient();
const [senderClient] = await viem.getWalletClients();

console.log("Sending 1 wei from", senderClient.account.address, "to itself");

const contract = await viem.deployContract("TokenReceiver", ["0xFa0DD45434E310daC6932b92A1B78fFD0Ed19285"]);

const feeToken = await contract.read.getNativeFee()
console.log({ feeToken });
console.log("Transaction sent successfully");
