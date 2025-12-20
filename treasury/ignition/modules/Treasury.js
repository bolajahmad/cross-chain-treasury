// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")

const TreasuryModule = buildModule("Treasury", (m) => {
    const MAX_SUPPLY = 4;
    const CONTROLLER = "0xcb266bdd77BFDe04bDe3a029173AF81e4E6Ec598";
    const token = m.contract("Treasury", [MAX_SUPPLY, CONTROLLER])

    return { token }
})

module.exports = TreasuryModule
