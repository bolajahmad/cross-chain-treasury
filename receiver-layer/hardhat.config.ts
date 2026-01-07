import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import { configVariable, defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";


export default defineConfig({
  plugins: [hardhatEthers, hardhatToolboxViemPlugin, hardhatVerify],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    }
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: "https://gateway.tenderly.co/public/sepolia",
      accounts: [configVariable("PRIVATE_KEY")],
    },
    baseSepolia: {
      type: "http",
      chainType: "l1",
      url: "https://base-sepolia.gateway.tenderly.co",
      accounts: [configVariable("PRIVATE_KEY")],
    },
    amoy: {
      type: "http",
      chainType: "l1",
      url: "https://polygon-amoy.api.onfinality.io/public",
      accounts: [configVariable("PRIVATE_KEY")],
    }
  },
});
