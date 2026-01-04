import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenReceiverModule", (m) => {
    const MNEE_ADDRESS = "0xFa0DD45434E310daC6932b92A1B78fFD0Ed19285";
  const receiver = m.contract("TokenReceiver", [
    MNEE_ADDRESS
  ]);

  return { receiver };
});
