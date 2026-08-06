import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { CONFIG } from "./config";

export const stonkNetwork = {
  id: CONFIG.chain.id,
  caipNetworkId: CONFIG.chain.caipNetworkId,
  chainNamespace: "eip155",
  name: CONFIG.chain.name,
  nativeCurrency: CONFIG.chain.nativeCurrency,
  rpcUrls: {
    default: {
      http: [CONFIG.chain.rpcUrl]
    }
  },
  blockExplorers: {
    default: {
      name: CONFIG.chain.explorerName,
      url: CONFIG.chain.explorerUrl
    }
  }
};

// Same Reown project ID used in the uploaded working wallet project.
const projectId = "4f71172824a0ea69b0270161482356fe";
const metadata = {
  name: "StonkMiners",
  description: "5,555 fully on-chain SVG miners",
  url: typeof window !== "undefined" ? window.location.origin : "https://stonkminers.vercel.app",
  icons: [typeof window !== "undefined" ? `${window.location.origin}/assets/logo.svg` : "https://stonkminers.vercel.app/assets/logo.svg"]
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks: [stonkNetwork],
  defaultNetwork: stonkNetwork,
  projectId,
  metadata,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#c8ff00",
    "--w3m-border-radius-master": "2px"
  },
  features: {
    analytics: true,
    email: false,
    socials: []
  }
});
