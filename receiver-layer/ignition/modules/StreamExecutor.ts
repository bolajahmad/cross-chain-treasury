// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StreamExecutor = buildModule("StreamExecutor", (m) => {
    const payout = m.contract("StreamExecutor")

    return { payout }
})

module.exports = StreamExecutor