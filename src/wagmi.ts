import { defineChain } from 'viem'
import { http, createConfig } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

export const fuseFlash = defineChain({
  id: 1264453517,
  name: 'FuseFlash',
  nativeCurrency: { name: 'Fuse', symbol: 'FUSE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.flash.fuse.io'] },
  },
  blockExplorers: {
    default: { name: 'Flash Explorer', url: 'https://explorer.flash.fuse.io' },
  },
})

export const config = createConfig({
  chains: [fuseFlash],
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [fuseFlash.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
