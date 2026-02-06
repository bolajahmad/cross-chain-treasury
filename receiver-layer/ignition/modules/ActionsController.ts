// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ActionsControllerModule = buildModule("ActionsController", (m) => {
  const HOST = "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a";
  const TREASURY = "0xc967d18A2BcC682c52A424b879EcA94215faE81b";

  const sourceChainId = 11155111;
  const sourceApp = "0x4D5e2aB8f41974f30f7Ec6Ef95Df61a5CB494E3A";
  const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177"

  const token = m.contract("ActionsController", [
    HOST,
    TREASURY,
    sourceChainId,
    sourceApp,
    feeToken
  ]);

  return { token };
});

module.exports = ActionsControllerModule;
