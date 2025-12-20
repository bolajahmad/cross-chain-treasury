import { cookieStorage, createConfig, createStorage, http, injected } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

const passetHub = {
  id: 420_420_422,
  name: 'PassetHub',
  network: 'Polkadot Hub Testnet',
  nativeCurrency: {
    decimals: 10,
    name: 'Paseo',
    symbol: 'PAS',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
  },
} as const;

const assetHub = {
  id: 420_420_421,
  name: 'AssetHub',
  network: 'Polkadot Asset Hub',
  nativeCurrency: {
    decimals: 10,
    name: "DOT",
    symbol: "DOT"
  },
  rpcUrls: {
    default: {
      http: ['https://asset-hub-eth-rpc.polkadot.io'],
    },
    public: {
      http: ['https://asset-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://assethub-polkadot.subscan.io',
    },
  },
} as const;


export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia, assetHub, passetHub],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    connectors: [injected()],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [assetHub.id]: http(),
      [passetHub.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
