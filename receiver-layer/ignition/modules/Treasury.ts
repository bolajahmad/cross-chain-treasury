// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TreasuryModule = buildModule("Treasury", (m) => {
    const MAX_ACTIONS = 20;
    const token = m.contract("Treasury", [MAX_ACTIONS])

    return { token }
})

module.exports = TreasuryModule
