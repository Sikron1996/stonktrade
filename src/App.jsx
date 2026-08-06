import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, JsonRpcProvider, parseEther } from "ethers";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { CONFIG, NFT_ABI } from "./config";

const WalletContext = createContext(null);
const readProvider = new JsonRpcProvider(CONFIG.chain.rpcUrl, CONFIG.chain.id, { staticNetwork: true });
const minerIds = Array.from({ length: 100 }, (_, i) => i + 1);

function shortAddress(address) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
}
function fileName(id) {
  return `/assets/brokers/broker_${String(id).padStart(3, "0")}.svg`;
}
async function ensureNetwork(walletProvider) {
  if (!walletProvider?.request) throw new Error("Wallet provider is not available.");
  const currentChain = await walletProvider.request({ method: "eth_chainId" });
  if (Number.parseInt(currentChain, 16) === CONFIG.chain.id) return;
  try {
    await walletProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CONFIG.chain.idHex }]
    });
  } catch (error) {
    if (error?.code !== 4902) throw error;
    await walletProvider.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: CONFIG.chain.idHex,
        chainName: CONFIG.chain.name,
        nativeCurrency: CONFIG.chain.nativeCurrency,
        rpcUrls: [CONFIG.chain.rpcUrl],
        blockExplorerUrls: [CONFIG.chain.explorerUrl]
      }]
    });
  }
}

function WalletProvider({ children }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount({ namespace: "eip155" });
  const { walletProvider } = useAppKitProvider("eip155");
  const [walletError, setWalletError] = useState("");

  const connect = useCallback(async () => {
    setWalletError("");
    try {
      await open({ view: isConnected ? "Account" : "Connect", namespace: "eip155" });
    } catch (error) {
      setWalletError(error?.message || "Wallet connection failed.");
    }
  }, [open, isConnected]);

  const browserProvider = useMemo(
    () => walletProvider ? new BrowserProvider(walletProvider) : null,
    [walletProvider]
  );

  const value = useMemo(() => ({
    account: address || "",
    browserProvider,
    walletProvider,
    connect,
    walletError
  }), [address, browserProvider, walletProvider, connect, walletError]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

function useWallet() {
  return useContext(WalletContext);
}

function StonkMinersApp() {
  const { account: address, browserProvider, walletProvider, connect } = useWallet();
  const isConnected = Boolean(address);

  const [quantity, setQuantity] = useState(1);
  const [minted, setMinted] = useState(0);
  const [status, setStatus] = useState(CONFIG.nft.address ? "Loading contract" : "Contract not connected");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(27);
  const [loaded, setLoaded] = useState(20);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState("");

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }, []);

  const refreshSupply = useCallback(async () => {
    if (!CONFIG.nft.address) return;
    try {
      const contract = new Contract(CONFIG.nft.address, NFT_ABI, readProvider);
      const supply = Number(await contract.totalSupply());
      setMinted(supply);
      setStatus(supply >= CONFIG.nft.maxSupply ? "Sold out" : "Mint is live");
    } catch (error) {
      console.error(error);
      setStatus("RPC unavailable");
    }
  }, []);

  useEffect(() => { refreshSupply(); }, [refreshSupply]);

  async function mint() {
    if (!isConnected || !address || !browserProvider) return connect();
    if (!CONFIG.nft.address) {
      showToast("Add the deployed contract address in src/config.js.");
      return;
    }
    setBusy(true);
    setStatus("Preparing transaction…");
    try {
      await ensureNetwork(walletProvider);
      const signer = await browserProvider.getSigner();
      const contract = new Contract(CONFIG.nft.address, NFT_ABI, signer);
      const value = parseEther((Number(CONFIG.nft.mintPrice) * quantity).toFixed(8));
      let tx;
      try {
        tx = await contract.mint(quantity, { value });
      } catch (firstError) {
        try {
          tx = await contract.publicMint(quantity, { value });
        } catch {
          throw firstError;
        }
      }
      setStatus(`Transaction sent: ${shortAddress(tx.hash)}`);
      await tx.wait();
      setStatus(`Success — ${quantity} StonkMiner${quantity > 1 ? "s" : ""} minted.`);
      showToast("StonkMiners minted successfully.");
      await refreshSupply();
    } catch (error) {
      console.error(error);
      const message = error?.reason || error?.shortMessage || error?.message || "Mint failed.";
      setStatus(message);
      showToast(message);
    } finally {
      setBusy(false);
    }
  }

  const filtered = minerIds.filter((id) => {
    if (filter === "lime") return id % 5 === 0 || id % 7 === 0;
    if (filter === "rare") return [7, 18, 31, 43, 56, 68, 77, 89, 97].includes(id);
    return true;
  });

  const total = (Number(CONFIG.nft.mintPrice) * quantity).toFixed(5);
  const progress = Math.min(100, (minted / CONFIG.nft.maxSupply) * 100);

  return (
    <>
      <div className="noise" />
      <header className="nav shell">
        <a className="brand" href="#top"><img src="/assets/logo.svg" alt=""/><span>STONK<span>MINERS</span></span></a>
        <nav><a href="#mint">Mint</a><a href="#gallery">Gallery</a><a href="#about">About</a></nav>
        <button className="wallet-button" onClick={connect}>{address ? shortAddress(address) : "Connect Wallet"}</button>
      </header>

      <main id="top">
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow">FULLY ON-CHAIN • 5,555 SVG MINERS</div>
            <h1>THE MARKET NEVER SLEEPS.<br/><span>NEITHER DO MINERS.</span></h1>
            <p>A collection of 5,555 pixel brokers built from on-chain SVG traits. Every miner is assembled directly by the contract and revealed at mint.</p>
            <div className="hero-actions"><a href="#mint" className="primary-button">Enter the mine</a><a href="#gallery" className="secondary-button">View collection</a></div>
            <div className="quick-stats"><div><b>5,555</b><span>Total supply</span></div><div><b>0.00005 ETH</b><span>Mint price</span></div><div><b>100</b><span>Max per wallet</span></div></div>
          </div>
          <div className="hero-art">
            <div className="ticker ticker-a">STONK ↑ 5555%</div><div className="ticker ticker-b">MINING BLOCK #0001</div>
            <img src={fileName(1)} alt="StonkMiner preview" className="main-miner"/>
            <img src={fileName(18)} alt="" className="floating-miner one"/><img src={fileName(43)} alt="" className="floating-miner two"/><img src={fileName(77)} alt="" className="floating-miner three"/>
          </div>
        </section>

        <section className="marquee"><div>STONKMINERS • FULLY ON-CHAIN • SVG TRAITS • INSTANT REVEAL • 5,555 SUPPLY • STONKMINERS • FULLY ON-CHAIN • SVG TRAITS • INSTANT REVEAL • 5,555 SUPPLY •</div></section>

        <section id="mint" className="mint-section shell">
          <div className="section-heading"><span>01 / MINT</span><h2>START MINING</h2></div>
          <div className="mint-layout">
            <div className="mint-preview"><img src={fileName(preview)} alt="Random StonkMiner"/><button className="shuffle-button" onClick={() => setPreview(1 + Math.floor(Math.random() * 100))}>↻ Shuffle preview</button></div>
            <div className="mint-panel">
              <div className="status-line"><span>Mint status</span><b>{status}</b></div>
              <div className="progress-wrap"><div className="progress-labels"><span>{minted.toLocaleString()} minted</span><span>5,555 total</span></div><div className="progress"><div style={{ width: `${progress}%` }}/></div></div>
              <div className="price-row"><div><small>Price per NFT</small><strong>0.00005 ETH</strong></div><div><small>Total</small><strong>{total} ETH</strong></div></div>
              <div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><div><span>Quantity</span><strong>{quantity}</strong></div><button onClick={() => setQuantity(Math.min(CONFIG.nft.maxPerWallet, quantity + 1))}>+</button></div>
              <button className="mint-button" onClick={mint} disabled={busy}>{busy ? "Minting…" : address ? (CONFIG.nft.address ? `Mint ${quantity} StonkMiner${quantity > 1 ? "s" : ""}` : "Contract address required") : "Connect wallet to mint"}</button>
              <p className="contract-note">WalletConnect/AppKit is active. Add the contract address and final network in <code>src/config.js</code>.</p>
            </div>
          </div>
        </section>

        <section id="gallery" className="gallery-section"><div className="shell">
          <div className="section-heading gallery-heading"><div><span>02 / COLLECTION</span><h2>MEET THE MINERS</h2></div><div className="gallery-controls">{[["all","All"],["lime","Lime"],["rare","Rare look"]].map(([key,label]) => <button key={key} className={`filter ${filter === key ? "active" : ""}`} onClick={() => { setFilter(key); setLoaded(20); }}>{label}</button>)}</div></div>
          <div className="gallery-grid">{filtered.slice(0, loaded).map((id) => { const rare = [7,18,31,43,56,68,77,89,97].includes(id); return <article className="miner-card" key={id}><img src={fileName(id)} alt={`StonkMiner #${id}`} loading="lazy"/><footer><b>STONK #{String(id).padStart(4,"0")}</b><span>{rare ? "RARE" : "MINER"}</span></footer></article>; })}</div>
          {loaded < filtered.length && <button className="load-button" onClick={() => setLoaded(loaded + 20)}>Load more miners</button>}
        </div></section>

        <section id="about" className="about-section shell"><div className="section-heading"><span>03 / ABOUT</span><h2>BUILT DIFFERENT</h2></div><div className="feature-grid">
          <article><b>01</b><h3>Fully on-chain</h3><p>Artwork and metadata are generated by the smart contract without external image hosting.</p></article>
          <article><b>02</b><h3>Instant reveal</h3><p>Your StonkMiner is assembled from SVG traits and visible immediately after mint.</p></article>
          <article><b>03</b><h3>Trait-rich collection</h3><p>Backgrounds, faces, hair, outfits, hats and accessories combine into thousands of miners.</p></article>
        </div></section>
      </main>

      <footer><div className="shell footer-inner"><div className="brand footer-brand"><img src="/assets/logo.svg" alt=""/><span>STONK<span>MINERS</span></span></div><p>5,555 miners. One market. No sleep.</p><div className="footer-links"><a href={CONFIG.social.x}>X</a><a href={CONFIG.social.opensea}>OS</a><a href={CONFIG.nft.address ? `${CONFIG.chain.explorerUrl}/address/${CONFIG.nft.address}` : "#"}>SC</a></div></div></footer>
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}


export default function App() {
  return <WalletProvider><StonkMinersApp /></WalletProvider>;
}
