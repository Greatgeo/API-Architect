# API Architect — Phase 4: Sanity Context MCP & Grounded Agent Engine

> **Agent Name**: API Architect Reasoning Engine  
> **Status**: Verified End-to-End · 8/8 Scenarios Passed · Server-Side MCP Integrated  
> **Core Principle**: *No evidence $\rightarrow$ no confident claim.*  
> **Epistemic Model**: 4-State (`COMPATIBLE`, `CONDITIONAL`, `INCOMPATIBLE`, `UNKNOWN`)  

---

## 1. Executive Summary

Phase 4 operationalizes the content lake authored in Phases 2 and 3 into an active, deterministic developer agent.

Rather than acting as a generic conversational LLM that hallucinates non-existent API parameters or invents blockchain endpoints, the **API Architect Agent**:
1. Normalizes developer natural language prompts into structured requirement models.
2. Interrogates **Sanity Context MCP** via a 7-stage retrieval strategy covering networks, capabilities, candidate products, endpoints, compatibility rules, constraints, and Knowledge Base documentation.
3. Evaluates candidates using a deterministic, four-state epistemic model (`COMPATIBLE`, `CONDITIONAL`, `INCOMPATIBLE`, `UNKNOWN`).
4. Generates an evidence-backed implementation blueprint complete with step-by-step instructions, verified endpoint contracts, safe code snippets, operational prerequisites, and identified knowledge gaps.

---

## 2. Agent Reasoning Pipeline

```text
Natural Language Developer Requirement
                 │
                 ▼
       Requirement Normalization
   (Networks, Capabilities, Auth, RPS)
                 │
                 ▼
       Staged Sanity Retrieval
(Context MCP: GROQ Queries + KB Search)
                 │
                 ▼
        Evidence Collection
 (Traceable Document Pointers & Claims)
                 │
                 ▼
    Deterministic Constraint Engine
 (Network / Capability / Auth / Rate Limits)
                 │
                 ▼
     Four-State Synthesis & Conflicts
 (Compatible / Conditional / Incompat / Unknown)
                 │
                 ▼
     Verified Implementation Plan
 (Endpoints, Steps, Code Examples, Risks)
                 │
                 ▼
   Interactive UI (Matrix & Evidence Panel)
```

---

## 3. The 4-State Epistemic Model

API Architect strictly adheres to the rule: **Never convert `unknown` into `unsupported` unless explicit evidence establishes incompatibility.**

| State | Definition | Example in API Architect |
|:---|:---|:---|
| **`COMPATIBLE`** | Documented evidence confirms native support across all stated requirements. | `product.aster-wallet` for Ethereum + Base token balances at 25 RPS. |
| **`CONDITIONAL`** | Supported only when an explicit prerequisite or setup step is satisfied. | `product.aster-wallet` for token transfers with webhooks (requires subscription registration). |
| **`INCOMPATIBLE`** | Documented evidence or fundamental protocol architecture prevents compatibility. | `product.solis-solana` attempting to query Ethereum EVM accounts. |
| **`UNKNOWN`** | The knowledge base does not contain sufficient verified evidence. | `product.northstar-data` queried for Avalanche C-Chain support. |

---

## 4. Ground-Truth Acceptance Verification

The agent was verified against all 8 scenarios using `npm run test:agent`:

1. **Ethereum Wallet Balance**: **PASS** (`product.northstar-data`, `product.aster-wallet`, `product.helios-rpc` identified as Compatible).
2. **Ethereum + Base Multi-Network**: **PASS** (`product.aster-wallet` Compatible; `product.northstar-data` Incompatible).
3. **Token Transfers + Webhooks**: **PASS** (`product.aster-wallet` Conditional on subscription registration).
4. **Incompatible Network Query (Solana + Ethereum)**: **PASS** (Correctly flagged as Incompatible).
5. **Authentication Filtering (Server API Key)**: **PASS** (Server-side key verified).
6. **Rate Limit Constraint ($\ge$ 20 RPS)**: **PASS** (`product.northstar-data` at 10 RPS Incompatible; `product.aster-wallet` Compatible).
7. **Unknown Evidence Check**: **PASS** (Reports Unknown rather than hallucinating support or assuming absence).
8. **Complex Architecture**: **PASS** (Multi-network + Webhooks + API Key + 20 RPS synthesized accurately).
