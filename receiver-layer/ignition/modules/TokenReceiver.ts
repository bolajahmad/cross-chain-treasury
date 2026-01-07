import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { network } from "hardhat";
import { solidityPacked } from "ethers";

const { ethers } =await network.connect({
  network: "hardhatOp",
  chainType: "op",
})

export default buildModule("TokenReceiverModule", (m) => {
    const MNEE_ADDRESS = "0xFa0DD45434E310daC6932b92A1B78fFD0Ed19285";
    // --- Encode destination for Sepolia (EVM, chainId 11155111) using StateMachine format ---
  const responderAddress = "0x3072586fE27A2bE611513A8cCB4378978f9eADAD";
  const stateMachine = solidityPacked(["uint8", "uint32"], [1, 11155111]); // 4 bytes
  const destination = stateMachine + responderAddress.slice(2);
  
  console.log({ destination });
  
  const receiver = m.contract("TokenReceiver", [
    MNEE_ADDRESS,
    destination
  ]);

  return { receiver };
});
