// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ActionsModule = buildModule("Actions", (m) => {
    const MAX_ACTIONS = 20;
    const token = m.contract("ActionsContract", [MAX_ACTIONS])

    return { token }
})

module.exports = ActionsModule