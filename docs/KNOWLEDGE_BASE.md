# API Architect — Sanity Knowledge Base & MCP Integration Guide

> **Knowledge Base Track**: Sanity Challenge 2026 — Path One (Ship an Agent That Queries Real Content)  
> **Status**: Prepared Locally & Verified · Remote Indexing Pending Project Credentials  
> **Knowledge Articles Authored**: 16 Substantial Guides (`knowledgeDocument`)  

---

## 1. Sanity Knowledge Base Architecture

Sanity Knowledge Bases provide semantic retrieval over long-form prose and documentation sources. In the API Architect architecture, knowledge retrieval is bifurcated between two specialized layers:

```text
Natural Language Developer Requirement
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
┌──────────────┐     ┌──────────────┐
│  GROQ Mode   │     │Knowledge Base│
│ (Structured) │     │(Semantic KB) │
└──────┬───────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
Products, Endpoints,   Architectural Guides,
Networks, Caps, Rules, Polling vs Webhooks,
Constraints (Exact)    Troubleshooting (Prose)
       │                    │
       └──────────┬─────────┘
                  ▼
         Unified Grounded
        Implementation Plan
```

### GROQ Mode (Structured Knowledge)
- Used for **deterministic reasoning**: matching networks, verifying endpoints, checking numeric rate limits, and looking up compatibility rules.
- Answers exact questions: *"Does Aster Wallet support Base?"* (Yes/No/Conditional).

### Knowledge Base Mode (Semantic Knowledge)
- Used for **conceptual guidance and troubleshooting**: trade-off explanations, HMAC security patterns, and error code remediation.
- Answers explanatory questions: *"Why must I use express.raw for webhooks?"* or *"When should I choose polling over webhooks?"*.

---

## 2. Prepared Knowledge Base Articles (`knowledgeDocument`)

| Document ID | Title | Category | Key Conceptual Takeaway |
|:---|:---|:---:|:---|
| `kb.choosing-blockchain-api` | Choosing a Blockchain Data API — A Decision Framework | `selection` | Direct RPC vs high-level indexer vs event streaming gateway trade-offs. |
| `kb.multichain-compatibility` | Understanding Multi-Chain Compatibility & Layer-2 Nuances | `protocols` | Base 2-second block cadence vs Ethereum 12s; L1 data posting costs. |
| `kb.network-limitations` | Network-Specific Limitations: Re-Orgs, Block Times, and Finality | `protocols` | Polygon 64-block re-org caveats; finality confirmation counts. |
| `kb.api-authentication-patterns`| API Authentication Patterns: API Keys, Bearer Tokens, and OAuth | `security` | Static API keys vs short-lived Bearer tokens vs delegated OAuth flows. |
| `kb.webhook-architecture` | Webhook Architecture for Real-Time Blockchain Events | `architecture` | 5-second acknowledgment deadline, raw body HMAC buffering, idempotency keys. |
| `kb.polling-vs-webhooks` | Polling vs. Webhooks: Trade-Off Analysis in Decentralized Systems | `architecture` | Polling latency and RPS quota drain vs webhook TLS requirements. |
| `kb.rate-limiting-strategies` | Rate Limiting Strategies & Client-Side Throughput Management | `troubleshooting` | Token bucket throttlers, exponential backoff with full jitter. |
| `kb.retry-failover-design` | Retry and Failover Design Across Heterogeneous API Providers | `architecture` | Designing fallback circuits from high-level indexers to raw node RPCs. |
| `kb.handling-unsupported-networks`| Handling Unsupported Networks and Designing Graceful Degradation | `selection` | Proactive compatibility checking to prevent runtime HTTP 400 errors. |
| `kb.secure-credential-handling` | Secure Credential Handling in Serverless and Full-Stack Web Apps | `security` | Eliminating VITE_ credential leaks; routing calls through backend proxies. |
| `kb.token-transfer-architecture` | Token Transfer Event Architecture: Ingestion, Filtering, Deduplication | `architecture` | ERC-20 Transfer topic0 hashing and address-indexed log extraction. |
| `kb.wallet-activity-feed` | Wallet Activity Architecture: Consolidating Transfers, Approvals, Gas | `architecture` | Normalizing multi-protocol transactions into a single human timeline. |
| `kb.portfolio-aggregation` | Cross-Chain Portfolio Aggregation and Price Oracle Synchronization | `architecture` | Combining multi-chain token holdings with USD price feeds; 15 RPS caching. |
| `kb.multichain-normalization` | Multi-Chain Data Normalization: Decimal Units, Addresses, Hashing | `protocols` | USDC (6 decimals) vs DAI (18 decimals); EIP-55 checksumming vs base58. |
| `kb.troubleshooting-integrations`| Troubleshooting API Integration Failures: Error Codes & Root Causes | `troubleshooting` | Diagnostic matrix for 400 UnsupportedNetwork, 401, 429, and 504 timeouts. |
| `kb.evidence-backed-selection` | Designing Evidence-Backed API Selection | `selection` | The 4-state epistemic model: Compatible, Conditional, Incompatible, Unknown. |

---

## 3. Remote Knowledge Base Provisioning (Phase 4 Setup Steps)

Because the project currently operates with local development configuration (`SANITY_PROJECT_ID="your_sanity_project_id"`), remote Knowledge Base creation is staged for execution once active organization credentials are provided:

1. **Dataset Import**:
   ```bash
   npx sanity dataset import scripts/seed/data/api-architect-dataset.ndjson production --replace
   ```
2. **Create Knowledge Base**:
   - Access Sanity Management Console -> Knowledge Bases (Beta).
   - Link the `production` dataset as document source.
   - Restrict indexing scope to `_type in ["knowledgeDocument", "implementationGuide", "codeExample"]`.
3. **Connect to Context MCP**:
   - Provide Knowledge Base ID in `SANITY_KNOWLEDGE_BASE_ID`.
   - Mount Context MCP endpoint in server reasoning pipeline.
