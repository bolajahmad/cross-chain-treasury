import { assertNotNull } from "@subsquid/util-internal";

export type NetworkConfig = {
  gateway: string;
  rpcEndpoint: string;
  finalityConfirmation: number;
  startAtBlock: number;
  contract: string[];
};

export const networksConfigs: NetworkConfig = {
  gateway: "https://v2.archive.subsquid.io/network/base-sepolia",
  rpcEndpoint: assertNotNull(
    process.env.RPC_BASE_HTTP,
    "No Base RPC endpoint supplied via env.RPC_BASE_HTTP",
  ),
  finalityConfirmation: 75,
  startAtBlock: 37099500,
  contract: [
    "0xc967d18A2BcC682c52A424b879EcA94215faE81b".toLowerCase(),
    "0x4791Ea0134eA66b40371A6Daf22d43e02bbB39f8".toLowerCase(),
  ],
};
