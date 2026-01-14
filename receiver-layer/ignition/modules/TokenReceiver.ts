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
  // const responderAddress = "0x68a801c28350f8cD950483DB4de6c569a2E89d1a";
  // const stateMachine = solidityPacked(["uint8", "uint32"], [1, 80002]); // 4 bytes
  // const destination = stateMachine + responderAddress.slice(2);
  
  // // const destination = 0x45564d2d3830303032
  // console.log({ destination, stateMachine });
  const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";

  const receiver = m.contract("TokenReceiver", [
    MNEE_ADDRESS,
    feeToken
  ]);

  return { receiver };
});
