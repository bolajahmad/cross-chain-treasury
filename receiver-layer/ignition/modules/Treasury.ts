// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TreasuryModule = buildModule("Treasury", (m) => {
    const MAX_SUPPLY = 4;
    const CONTROLLER = "0x68a801c28350f8cD950483DB4de6c569a2E89d1a";
    const token = m.contract("Treasury", [MAX_SUPPLY, CONTROLLER])

    return { token }
})

module.exports = TreasuryModule
