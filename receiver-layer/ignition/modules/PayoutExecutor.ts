// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PayoutExecutor = buildModule("PayoutExecutor", (m) => {
    const payout = m.contract("PayoutExecutor")

    return { payout }
})

module.exports = PayoutExecutor