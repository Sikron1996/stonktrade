# StonkMiners — exact AppKit wallet transplant

The wallet connection architecture is copied from the uploaded working project:

- `createAppKit` + `EthersAdapter`
- the same Reown Project ID
- `useAppKit`, `useAppKitAccount`, `useAppKitProvider`
- the same `WalletProvider` / React Context pattern
- the same Connect/Account modal behavior
- the same chain switch and add-chain flow

Only project branding and collection configuration were changed to StonkMiners.

## Contract setup

Edit `src/config.js` after deployment. Insert the NFT contract address and final chain details.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
