import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MockMneeModule", (m) => {
  const mockMnee = m.contract("MockMnee", [
    "Mock MNEE", "MNEE", 18
  ]);

  return { mockMnee };
});
