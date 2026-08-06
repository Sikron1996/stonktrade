export const CONFIG = {
  // The network is currently copied from the uploaded Node/Stable Punks wallet build.
  // Replace these values when the StonkMiners deployment network is final.
  chain: {
    id: 988,
    idHex: "0x3dc",
    caipNetworkId: "eip155:988",
    namespace: "eip155",
    name: "Stable Mainnet",
    nativeCurrency: { name: "USDT0", symbol: "USDT0", decimals: 18 },
    rpcUrl: "https://rpc.stable.xyz",
    explorerUrl: "https://stablescan.xyz"
  },
  nft: {
    address: "",
    maxSupply: 5555,
    mintPrice: "0.00005",
    maxPerWallet: 100,
    mintFunction: "mint"
  },
  walletConnect: {
    // Same Reown project ID used by the uploaded wallet-fixed site.
    projectId: "4f71172824a0ea69b0270161482356fe"
  },
  social: {
    x: "#",
    opensea: "#"
  }
};

export const NFT_ABI = [
  "function mint(uint256 quantity) payable",
  "function publicMint(uint256 quantity) payable",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)"
];
