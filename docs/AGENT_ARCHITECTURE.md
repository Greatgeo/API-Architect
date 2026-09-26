# API Architect — Agent Architecture & Pipeline Specification

> **Module Location**: `lib/agent/`  
> **Architecture Style**: Transport-Independent Reasoning Engine  

---

## 1. Directory Structure

```text
lib/
  agent/
    types.ts            # Normalized requirement, evidence, and constraint types
    requirements.ts     # Natural language entity extraction & ambiguity detection
    retrieve.ts         # 7-stage targeted retrieval pipeline
    evidence.ts         # Traceable evidence formatting & provenance tagging
    constraints.ts      # Deterministic 4-state constraint evaluation engine
    planner.ts          # Actionable implementation blueprint generator
    orchestrator.ts     # Master coordinator executing the end-to-end flow

  mcp/
    types.ts            # MCP request/response interfaces & health types
    client.ts           # Sanity Context MCP HTTP/SSE client abstraction
    sanityContext.ts    # Dual-mode service bridging live MCP and local fallback

  sanity/
    datasetAdapter.ts   # High-speed local dataset adapter for development
```

---

## 2. Deterministic vs. Generative Responsibilities

To achieve 100% reproducibility and eliminate hallucinations, responsibilities are strictly partitioned:

| Engine Layer | Mechanism | Responsibility |
|:---|:---|:---|
| **Entity Extraction** | Deterministic Pattern Matcher + NLP | Maps blockchain names, capabilities, auth methods, and numeric RPS constraints without adding unverified assumptions. |
| **Retrieval** | Sanity Context MCP (GROQ & KB) | Fetches relevant graph documents and semantic articles based on normalized query keys. |
| **Constraint Evaluation** | Deterministic Decision Matrix | Evaluates candidate compatibility against explicit rules and numeric limits. Enforces 4-state classification (`COMPATIBLE`, `CONDITIONAL`, `INCOMPATIBLE`, `UNKNOWN`). |
| **Synthesis & Planning** | Structured Planner | Assembles step-by-step developer instructions, endpoint contracts, verified code examples, and operational warnings grounded exclusively in retrieved documents. |

---

## 3. Ambiguity & Missing Information Handling

When a developer requirement contains underspecified parameters:
- **Ambiguity Detection**: Prompts mentioning "real-time events" without specifying delivery transport (webhooks, websockets, polling) are flagged as ambiguous in `isAmbiguous: true` with explanatory guidance.
- **Missing Information**: Missing networks or unspecified throughput limits are tracked explicitly in `missingInformation: string[]`.
- **Knowledge Gaps (Unknowns)**: Unverified queries (e.g. querying a network absent from the dataset) are recorded in `unresolvedUnknowns: string[]` rather than guessed.
