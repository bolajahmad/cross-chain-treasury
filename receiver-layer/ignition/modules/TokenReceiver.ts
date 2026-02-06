import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenReceiverModule", (m) => {
    // --- Encode destination for Sepolia (EVM, chainId 11155111) using StateMachine format ---
    
  const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";
  const hostContract = 	"0x2EdB74C269948b60ec1000040E104cef0eABaae8";

  const receiver = m.contract("TokenReceiver", [
    feeToken,
    hostContract
  ]);

  return { receiver };
});
