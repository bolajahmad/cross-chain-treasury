import { assertNotNull } from "@subsquid/util-internal";

export type NetworkConfig = {
  gateway: string;
  chain: "base" | "eth";
  rpcEndpoint: string;
  finalityConfirmation: number;
  startAtBlock: number;
  contract: string;
};

export const networksConfigs: Record<string, NetworkConfig> = {
  base: {
    gateway: "https://v2.archive.subsquid.io/network/base-sepolia",
    rpcEndpoint: assertNotNull(
      process.env.RPC_BASE_HTTP,
      "No Base RPC endpoint supplied via env.RPC_BASE_HTTP"
    ),
    finalityConfirmation: 75,
    startAtBlock: 36085255,
    contract: "0xF474302a32ebaA69f230cdaF2c14Def1dEdd93FF".toLowerCase(),
    chain: "base",
  },
  eth: {
    gateway: "https://v2.archive.subsquid.io/network/ethereum-sepolia",
    rpcEndpoint: assertNotNull(
      process.env.RPC_ETH_HTTP,
      "No ETH RPC endpoint supplied via env.RPC_ETH_HTTP"
    ),
    finalityConfirmation: 15,
    startAtBlock: 10003343,
    contract: "0x4B4f204aE2D357a71B4dED68d25b2C9FD62053A3".toLowerCase(),
    chain: "eth",
  },
};
