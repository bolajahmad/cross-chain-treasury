// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TreasuryControllerModule = buildModule("TreasuryController", (m) => {
    // const HOST = "0x9a2840D050e64Db89c90Ac5857536E4ec66641DE"; // AMoy Host
    const HOST = "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a"
    const TREASURY = "0xF474302a32ebaA69f230cdaF2c14Def1dEdd93FF";
    const token = m.contract("TreasuryController", [HOST, TREASURY]);

    return { token }
})

module.exports = TreasuryControllerModule
