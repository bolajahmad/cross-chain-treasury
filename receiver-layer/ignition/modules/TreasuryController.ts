// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TreasuryControllerModule = buildModule("TreasuryController", (m) => {
  // const HOST = "0x9a2840D050e64Db89c90Ac5857536E4ec66641DE"; // AMoy Host
  const HOST = "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a";
  const TREASURY = "0xBCDe18F053AD8F6Ca6Fb0e7d80b051bD77350126";

  const sourceChainId = 11155111;
  const sourceApp = "0x2Cea0acbab5D5788d241D7279b2ebE0C5d49512D";

  const token = m.contract("TreasuryController", [
    HOST,
    TREASURY,
    sourceChainId,
    sourceApp,
  ]);

  return { token };
});

module.exports = TreasuryControllerModule;
