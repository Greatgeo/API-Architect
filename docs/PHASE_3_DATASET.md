# API Architect — Phase 3: Controlled Demonstration Dataset & Knowledge Base

> **Dataset Name**: API Architect Controlled Demonstration Dataset  
> **Version**: 1.0.0  
> **Status**: Validated Locally (0 Errors) · NDJSON Ready · Benchmark Verified (8/8 Scenarios Passed)  
> **Graph Complexity**: 159 Documents · 557 Typed References · 0 Dangling Links  
> **Competition Track**: Sanity Challenge 2026 — Path One: Ship an Agent That Queries Real Content  

---

## 1. Overview & Purpose

In Phase 3 of API Architect, we constructed the complete, reproducible **reasoning substrate** that will power the AI agent in Phase 4 (Sanity Context MCP). 

Generic LLMs hallucinate non-existent API parameters, invent endpoints, and fail to identify network-specific limitations (such as assuming every API supporting Ethereum automatically supports Base, or missing that webhook delivery requires explicit subscription configuration).

The **API Architect Controlled Dataset** provides an interconnected, deterministic content layer designed specifically for multi-variable compatibility and constraint reasoning:
- **11 Controlled API Products** across data, wallets, RPCs, event gateways, portfolios, and settlement.
- **31 API Endpoints** with exact HTTP verbs, paths, parameter contracts, response schemas, and rate limits.
- **10 Blockchain Networks** covering Ethereum L1, Base L2, Arbitrum, Optimism, Polygon, Avalanche, BSC, Solana, and testnets.
- **18 Technical Capabilities** covering balances, transfers, webhooks, transaction history, and contract logs.
- **22 Compatibility Rules** explicitly defining `compatible`, `conditional`, `incompatible`, and `unknown` relationships.
- **18 Operational Constraints** categorizing security, rate limits, network traits, and deployment requirements.
- **12 Implementation Guides** providing step-by-step developer tutorials.
- **12 Verified Code Examples** in TypeScript, JavaScript, Python, and cURL with safe placeholder credentials.
- **9 Core Technologies** modeling runtimes, languages, frameworks, and protocols.
- **16 Knowledge Documents** providing in-depth architectural prose for Sanity Knowledge Base indexing.

---

## 2. Dataset Summary Counts

| Entity Type | Schema Type | Target | Authored Count | Key Differentiators |
|:---|:---|:---:|:---:|:---|
| **API Products** | `apiProduct` | 10–12 | **11** | Distinct categories, rates (10–100 RPS), auth schemes, supported networks. |
| **API Endpoints** | `apiEndpoint` | 25–30 | **31** | Parameter contracts, response schemas, rate limits, capability links. |
| **Networks** | `network` | 8–10 | **10** | Chain IDs, consensus types (evm, layer2, non_evm), environment stages. |
| **Capabilities** | `capability` | 15–20 | **18** | Standardized identifiers (e.g. `token_transfer_events`, `wallet_balance`). |
| **Compatibility Rules** | `compatibilityRule` | 20–25 | **22** | Compatible, conditional, incompatible, unknown states with grounded explanations. |
| **Constraints** | `constraint` | 15–20 | **18** | Severity levels (info, warning, blocking), trigger conditions, workarounds. |
| **Implementation Guides**| `implementationGuide`| 10–15 | **12** | Ordered step sequences, prerequisites, common troubleshooting recipes. |
| **Code Examples** | `codeExample` | 10–15 | **12** | TypeScript, JavaScript, Python, cURL with safe environment placeholders. |
| **Technologies** | `technology` | 8–10 | **9** | Node.js, TypeScript, Express, Next.js, Python, cURL, Webhooks, etc. |
| **Knowledge Documents** | `knowledgeDocument` | $\ge 15$ | **16** | Comprehensive architectural guides for Sanity Knowledge Base indexing. |
| **Total Documents** | — | ~130+ | **159** | **100% Validated (557 References, 0 Dangling Links)** |

---

## 3. Controlled Demonstration Authenticity Notice

In strict accordance with the Competition Rules and Phase 3 instructions:
- **Controlled Demo Products**: API products are explicitly marked as controlled demonstration records (e.g. *Northstar Data API — Controlled Demo*, *Aster Wallet API — Controlled Demo*, *Orbit Event Gateway — Controlled Demo*).
- **No False Vendor Claims**: No real-world commercial vendors are falsely attributed or misrepresented.
- **Verified Network Standards**: Real blockchain concepts and verified Chain IDs are used (Ethereum: `1`, Base: `8453`, Polygon: `137`, Arbitrum: `42161`, Optimism: `10`, etc.).
- **No Fabricated URLs**: Documentation links point to internal demo paths (`https://api-architect.internal/demo/...`) or official protocol foundations.

---

## 4. Multi-Constraint Scenario Verification

The dataset was benchmarked against the 8 core scenarios defined in Section 25:

1. **Simple Query (Ethereum Wallet Balance)**: `product.northstar-data`, `product.aster-wallet`, `product.helios-rpc` are returned as **Compatible**.
2. **Multi-Network (Ethereum + Base Token Balances)**: `product.aster-wallet` is **Compatible** (supports both). `product.northstar-data` is **Incompatible** (Base unsupported).
3. **Conditional Reasoning (Transfers + Webhooks on Eth + Base)**: `product.aster-wallet` and `product.orbit-event` are returned as **Conditional** (requires webhook subscription and TLS endpoint).
4. **Incompatible Query (Solana + Ethereum on EVM API)**: Correctly flagged as **Incompatible** due to non-EVM account model.
5. **Authentication Filtering (Server-Side API Key)**: Correctly distinguishes API key vs Bearer vs OAuth vs Webhook HMAC.
6. **Rate Limit Constraint ($\ge$ 20 RPS)**: `product.northstar-data` (10 RPS) is rejected as **Incompatible**; `product.aster-wallet` (25 RPS) and `product.helios-rpc` (100 RPS) are accepted.
7. **Unknown / Insufficient Evidence (Avalanche on Northstar)**: Correctly reports **Unknown** rather than hallucinating support or assuming absence.
8. **Complex Architecture (Full Dashboard)**: Synthesizes networks, capabilities, endpoints, rate limits, and webhook caveats simultaneously.

---

## 5. Seed Dataset Package & CLI Usage

The seed package is fully automated and reproducible:

```bash
# Validate dataset integrity (159 documents, 557 references)
npm run seed:validate

# Export dataset into combined and type-specific NDJSON files
npm run seed:export

# Run the 8 ground-truth benchmark scenarios
npm run test:dataset

# Run both validation and benchmark checks
npm run dataset:check
```
