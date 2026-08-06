export const CONFIG = {
  chain: {
    id: 4663,
    idHex: "0x1237",
    caipNetworkId: "eip155:4663",
    namespace: "eip155",
    name: "Robinhood Chain",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrl: "https://rpc.mainnet.chain.robinhood.com/",
    explorerName: "Robinhood Chain Explorer",
    explorerUrl: "https://robinhoodchain.blockscout.com"
  },
  nft: {
    address: "0xa1FD0be9F3338D2048bA1DE62374b806F7765D43",
    maxSupply: 5555,
    mintPrice: "0.00005",
    maxPerWallet: 100,
    mintFunction: "mint"
  },
  walletConnect: {
    projectId: "4f71172824a0ea69b0270161482356fe"
  },
  social: {
    x: "#",
    opensea: "#"
  }
};

export const NFT_ABI = [
  "function mint(uint256 quantity) payable",
  "function totalSupply() view returns (uint256)",
  "function mintPrice() view returns (uint256)",
  "function saleActive() view returns (bool)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function mintedByWallet(address owner) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)"
];
