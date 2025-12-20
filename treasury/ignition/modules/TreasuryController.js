// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")

const TreasuryControllerModule = buildModule("TreasuryController", (m) => {
    const HOST = "0x8Aa0Dea6D675d785A882967Bf38183f6117C09b7";
    const token = m.contract("TreasuryController", [HOST])

    return { token }
})

module.exports = TreasuryControllerModule
