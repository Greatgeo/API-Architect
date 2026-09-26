# API Architect — Dataset Specification & Entity Dictionary

> **Specification Standard**: Semantic Knowledge Graph for Autonomous API Selection  
> **Total Entities**: 159 Documents across 10 Schema Types  

---

## 1. Controlled Demonstration Products (`apiProduct`)

| Product ID | Display Name | Provider | Supported Networks | Throughput | Auth Methods | Key Differentiator |
|:---|:---|:---|:---|:---:|:---:|:---|
| `product.northstar-data` | Northstar Data API | Northstar Labs | Ethereum, Polygon | 10 RPS | `api_key` | High-speed indexing on Eth/Polygon. **No Base, no webhooks**. |
| `product.aster-wallet` | Aster Wallet API | Aster Protocol | Ethereum, Base, Arbitrum, Optimism | 25 RPS | `api_key`, `bearer` | Full multi-chain wallet balances and transfer events. **Webhooks conditional on registration**. |
| `product.orbit-event` | Orbit Event Gateway | Orbit Network | Ethereum, Base, Polygon, Arbitrum | 50 RPS | `bearer`, `webhook_secret` | Real-time event streaming and push notifications. **Mandatory public HTTPS TLS endpoint**. |
| `product.solis-solana` | Solis Solana API | Solis Labs | Solana | 30 RPS | `api_key` | Specialized for Solana mainnet-beta. **Strictly incompatible with EVM**. |
| `product.helios-rpc` | Helios Multi-Chain RPC | Helios Node Consortium | Ethereum, Base, Polygon, Arbitrum, Optimism, Avalanche, BSC, Sepolia | 100 RPS | `api_key` | Low-latency JSON-RPC 2.0 proxy. Raw format only (no high-level transfer events). |
| `product.nexus-portfolio` | Nexus Portfolio API | Nexus Finance | Ethereum, Base, Polygon, Arbitrum | 15 RPS | `oauth`, `api_key` | Multi-chain net worth and NFT indexing. **Requires 60s caching due to 15 RPS limit**. |
| `product.quanta-indexer` | Quanta Chain Indexer | Quanta Analytics | Ethereum, Base | 20 RPS | `api_key` | Smart contract event log filtering. **100k block range query limit**. |
| `product.strata-pay` | Strata Settlement API | Strata Global Pay | Ethereum, Polygon, Avalanche | 10 RPS | `api_key` | Stablecoin transfer settlement verification. |
| `product.beacon-identity` | Beacon Identity API | Beacon Labs | Ethereum, Base, Optimism | 15 RPS | `bearer` | Wallet activity profiling and address categorization. |
| `product.vanguard-gas` | Vanguard Gas & Simulation | Vanguard Infra | Ethereum, Base, Arbitrum, Optimism, Polygon | 50 RPS | `api_key` | EIP-1559 gas predictions and call simulation with state overrides. |
| `product.zenith-activity` | Zenith Activity Stream | Zenith Realtime | Ethereum, Base, Sepolia | 20 RPS | `api_key` | Real-time address activity trapping. Requires active stream subscription. |

---

## 2. Blockchain Networks (`network`)

| Network ID | Name | Architecture | Chain ID | Environment | Supported Capabilities |
|:---|:---|:---:|:---:|:---:|:---|
| `network.ethereum` | Ethereum Mainnet | `evm` | `1` | `mainnet` | Balances, transfers, logs, RPC, calls, gas estimation. |
| `network.base` | Base | `layer2` | `8453` | `mainnet` | Balances, transfers, webhooks, RPC, gas estimation. |
| `network.polygon` | Polygon PoS | `sidechain` | `137` | `mainnet` | Balances, transfers, logs, RPC. (Warning: re-org depth up to 64 blocks). |
| `network.arbitrum` | Arbitrum One | `layer2` | `42161` | `mainnet` | Balances, transfers, RPC, calls. |
| `network.optimism` | OP Mainnet | `layer2` | `10` | `mainnet` | Balances, transfers, RPC. |
| `network.avalanche` | Avalanche C-Chain | `evm` | `43114` | `mainnet` | Balances, RPC. |
| `network.bsc` | BNB Smart Chain | `evm` | `56` | `mainnet` | Balances, RPC. |
| `network.solana` | Solana Mainnet-Beta | `non_evm` | `101` | `mainnet` | Native balance, SPL tokens, signatures, activity. (Base58 required). |
| `network.sepolia` | Sepolia Testnet | `evm` | `11155111` | `testnet` | Testing balance, RPC. |
| `network.base-sepolia` | Base Sepolia | `layer2` | `84532` | `testnet` | Testing balance, transfers, RPC. |

---

## 3. Technical Capabilities (`capability`)

1. `capability.wallet-balance`: Read native gas coin balance.
2. `capability.token-balance`: Enumerate ERC-20 / SPL token balances.
3. `capability.token-transfer-events`: Stream or query indexed transfer events across blocks.
4. `capability.transaction-history`: Paginated list of historical transactions.
5. `capability.transaction-lookup`: Inspect single transaction receipt by hash.
6. `capability.wallet-activity`: Consolidated activity feed of approvals, transfers, and swaps.
7. `capability.block-lookup`: Block headers, timestamps, and inclusion records.
8. `capability.contract-event-logs`: Query raw contract logs filtered by 32-byte topics.
9. `capability.webhook-notifications`: Instant server-to-server HTTP push callbacks.
10. `capability.nft-ownership`: Enumerate NFT token IDs owned by a wallet address.
11. `capability.nft-metadata`: Retrieve JSON metadata, media URIs, and attributes.
12. `capability.portfolio-aggregation`: Calculate aggregated USD net worth across chains.
13. `capability.token-metadata`: Token name, symbol, decimals, and icon URL.
14. `capability.address-monitoring`: Automated threshold alerts on wallet activity.
15. `capability.rpc-access`: Direct JSON-RPC proxy execution.
16. `capability.smart-contract-calls`: View function read simulation (eth_call).
17. `capability.gas-estimation`: EIP-1559 tip fee recommendations.
18. `capability.multi-chain-aggregation`: Unified response aggregating multiple networks.

---

## 4. Key Compatibility Rules (`compatibilityRule`)

* **`rule.aster-ethereum-base` (Compatible)**: Aster Wallet natively indexes Base L2 blocks and Ethereum L1.
* **`rule.northstar-base-incompatible` (Incompatible)**: Northstar Data does NOT index Base; calling Base yields HTTP 400.
* **`rule.solis-ethereum-incompatible` (Incompatible)**: Solis Solana cannot serve EVM hex addresses or Ethereum RPC.
* **`rule.aster-token-transfers-webhooks` (Conditional)**: Aster Wallet transfer push events require registering an active webhook subscription endpoint.
* **`rule.orbit-webhooks-tls` (Conditional)**: Orbit Gateway webhooks require a public HTTPS destination with valid TLS certificate.
* **`rule.northstar-avalanche-unknown` (Unknown)**: The controlled dataset contains no documented evidence for Northstar on Avalanche. The system explicitly reports unknown rather than assuming unsupported.
