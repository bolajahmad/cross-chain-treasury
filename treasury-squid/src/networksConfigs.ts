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
    startAtBlock: 36222660,
    contract: "0xBCDe18F053AD8F6Ca6Fb0e7d80b051bD77350126".toLowerCase(),
    chain: "base",
  },
  eth: {
    gateway: "https://v2.archive.subsquid.io/network/ethereum-sepolia",
    rpcEndpoint: assertNotNull(
      process.env.RPC_ETH_HTTP,
      "No ETH RPC endpoint supplied via env.RPC_ETH_HTTP"
    ),
    finalityConfirmation: 15,
    startAtBlock: 10016240,
    contract: "0x6E152F7CDba7ecdec2406c3Cf9Fa48a24cf54D1a".toLowerCase(),
    chain: "eth",
  },
};
