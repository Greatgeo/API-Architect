# API Architect — Agent Testing & Benchmark Verification

> **Test Suite**: `tests/agent/verify-agent-scenarios.ts`  
> **Script**: `npm run test:agent`  
> **Execution Status**: **8 / 8 Scenarios Passed (100% Deterministic Agreement)**  

---

## 1. Ground-Truth Scenarios & Execution Matrix

| # | Scenario Title | Requirement Tested | Expected Status | Result |
|:---:|:---|:---|:---:|:---:|
| **1** | Ethereum wallet balance | Native balance checking on Ethereum L1 | `COMPATIBLE` | **PASS** |
| **2** | Ethereum + Base | Multi-network token balance across L1 & L2 | `COMPATIBLE` | **PASS** |
| **3** | Token transfer + webhook | ERC-20 event streaming with webhook push | `CONDITIONAL` | **PASS** |
| **4** | Incompatible network | Querying Solana and Ethereum in EVM format | `INCOMPATIBLE` | **PASS** |
| **5** | Authentication | Server-side API key credential handling | `COMPATIBLE` | **PASS** |
| **6** | Rate limit | Throughput threshold ($\ge$ 20 RPS) | `COMPATIBLE` | **PASS** |
| **7** | Unknown evidence | Avalanche support on Northstar Data API | `UNKNOWN` | **PASS** |
| **8** | Complex architecture | Full dashboard with Eth + Base + Webhooks + 20 RPS | `CONDITIONAL` | **PASS** |

---

## 2. Test Execution Command

To run the full agent test suite:

```bash
# Run the 8 ground-truth scenarios through the live agent pipeline
npm run test:agent

# Run both Phase 3 dataset check and Phase 4 agent verification
npm run test:dataset && npm run test:agent
```
