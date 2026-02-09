import { assertNotNull } from "@subsquid/util-internal";

export type NetworkConfig = {
  gateway: string;
  chain: "base" | "eth";
  rpcEndpoint: string;
  finalityConfirmation: number;
  startAtBlock: number;
  contract: string[];
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
    contract: ["0x062F3Dcf2D3584a0095a52Ccec29975bfCf3A7a1".toLowerCase(), "0x4791Ea0134eA66b40371A6Daf22d43e02bbB39f8".toLowerCase()],
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
    contract: ["0x52B6df3c98225F040b9B89A07180E7Bc6ba34f87".toLowerCase()],
    chain: "eth",
  },
};
