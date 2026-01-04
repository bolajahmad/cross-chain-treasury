// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TreasuryControllerModule = buildModule("TreasuryController", (m) => {
    const HOST = "0x9a2840D050e64Db89c90Ac5857536E4ec66641DE";
    const token = m.contract("TreasuryController", [HOST])

    return { token }
})

module.exports = TreasuryControllerModule
