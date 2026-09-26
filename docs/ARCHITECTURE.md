# API Architect — System Architecture Specification

> **Project**: API Architect  
> **Tagline**: *Turn a developer requirement into a verified API implementation plan.*  
> **Challenge**: Sanity Challenge 2026 (Path One: Ship an Agent That Queries Real Content)  
> **Phase**: Phase 1 — Architecture & Project Foundation  

---

## 1. Architectural Vision & Goal

Developer tooling powered by naive LLMs often hallucinates non-existent API parameters, recommends deprecated SDKs, or ignores network constraints (e.g. recommending WebSocket filters on endpoints that only support webhooks or polling).

**API Architect** eliminates hallucination by turning developer requirements into a **verified API implementation plan** grounded in real, structured content stored in **Sanity Content Lake** and retrieved via **Sanity Context MCP**.

The agent does not generate code from raw model weights; it retrieves validated documentation nodes, verifies compatibility rules and constraint severities, and attaches concrete evidence citations to every implementation step.

---

## 2. End-to-End System Architecture

The following diagram illustrates the complete data flow from developer prompt to verified plan delivery:

```
┌─────────────────────────────────────────────────────────────┐
│                          DEVELOPER                          │
│        (Enters natural language requirement in UI)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND INTERFACE (REACT)                  │
│       • Developer Requirement Input & Objective Parsing     │
│       • Real-time Verification Status & Evidence Cards       │
│       • Actionable Implementation Steps & Code Viewer       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ HTTPS / JSON (Zero Secrets)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 API ARCHITECT SERVER (EXPRESS)              │
│       • Input Sanitization & Goal Decomposition             │
│       • Server-side Orchestration Pipeline                  │
│       • Error Handling & Progressive Diagnostics            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ Authenticated Server-Side RPC
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             AI REASONING LAYER (AGENT / ENGINE)             │
│       • Technical Constraint Extractor                      │
│       • Semantic Query Generator                            │
│       • Anti-Hallucination Guardrails                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ MCP Protocol (Tools / Resources)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     SANITY CONTEXT MCP                      │
│       • Contextual semantic retrieval                       │
│       • Graph-aware document traversal                      │
│       • Exact schema and document references                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
┌─────────────────────────────────┐ ┌─────────────────────────────────┐
│   SANITY STRUCTURED CONTENT     │ │     SANITY KNOWLEDGE BASE       │
│ • Products, Endpoints, Networks │ │ • Implementation Guides         │
│ • Capabilities & Constraints    │ │ • Production Code Examples      │
│ • Compatibility Rules           │ │ • Troubleshooting Workarounds   │
└────────────────┬────────────────┘ └────────────────┬────────────────┘
                 └─────────────┬─────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               EVIDENCE & CONSTRAINT REASONING               │
│       • Validates requirement against compatibility rules   │
│       • Classifies status (compatible/conditional/blocking) │
│       • Identifies missing or conflicting requirements      │
│       • Synthesizes ground-truth citations                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                VERIFIED IMPLEMENTATION PLAN                 │
│       • Proven endpoint configurations & code               │
│       • Explicit "WHY" rationale with citation evidence     │
│       • Unambiguous warnings for unsupported items          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
                           DEVELOPER
```

---

## 3. Layer Responsibilities

### 3.1 Client Interface (Browser / React UI)
- **Role**: Presentation and developer interaction.
- **Responsibilities**:
  - Accept requirements via developer-centric input.
  - Display progressive stages: requirement analysis, Sanity retrieval, compatibility evaluation, verified plan.
  - Present evidence drawer with direct links to Sanity document records.
  - Provide interactive code snippet copies and warning banners for conditional edge-cases.
- **Constraints**: Contains ZERO private credentials, API tokens, or direct Sanity write keys.

### 3.2 API Architect Server
- **Role**: Secure gateway and operational orchestration layer.
- **Responsibilities**:
  - Provides `/api/health` and future `/api/architect/analyze` endpoints.
  - Validates developer input using strict zod/schema guards.
  - Manages session rate-limiting and sanitizes payload.
  - Houses all server secrets safely behind the network boundary.

### 3.3 AI Reasoning Layer
- **Role**: Cognitive agent responsible for planning and verification.
- **Responsibilities**:
  - Extracts explicit goals (e.g. *token transfer monitoring*), targets (e.g. *Ethereum*, *Base*), and delivery mechanisms (e.g. *webhooks*).
  - Translates goals into structured queries for the Sanity Context MCP.
  - Formulates candidate solutions based exclusively on retrieved evidence.
  - Declares requirements unsupported when no matching documentation exists.

### 3.4 Sanity Context MCP (Model Context Protocol)
- **Role**: Standardized retrieval bridge into Sanity Content Lake.
- **Responsibilities**:
  - Exposes Sanity Content Lake documents as structured MCP resources and tools.
  - Allows the AI model to query related entities (Network -> Capability -> Constraint -> Rule).
  - Retrieves authoritative documentation excerpts and document IDs.

### 3.5 Sanity Content Lake & Knowledge Base
- **Role**: Authoritative single source of truth for technical data.
- **Responsibilities**:
  - Stores structured documents: `apiProduct`, `apiEndpoint`, `network`, `capability`, `constraint`, `compatibilityRule`, `implementationGuide`, `codeExample`.
  - Managed by technical writers and API maintainers via Sanity Studio.

### 3.6 Evidence & Constraint Reasoning Engine
- **Role**: Deterministic rule checker and evidence synthesizer.
- **Responsibilities**:
  - Cross-references extracted requirements against `compatibilityRule` records.
  - Flags conflicts (e.g. network rate limit vs requested streaming frequency).
  - Produces human-readable "WHY" explanations referencing Sanity document IDs.

---

## 4. Security Boundary & Credential Isolation

```
┌─────────────────────────────────────────────────────────────┐
│ BROWSER / CLIENT LAYER (UNTRUSTED)                          │
│                                                             │
│ • Runs React SPA client code                                │
│ • No private tokens or service credentials                  │
│ • Only receives sanitized, verified responses               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS API Calls (Bearer / Session)
═══════════════════════════════╪═══════════════════════════════
                    SECURITY BOUNDARY
═══════════════════════════════╪═══════════════════════════════
┌──────────────────────────────┴──────────────────────────────┐
│ SERVER-SIDE ENVIRONMENT (TRUSTED)                           │
│                                                             │
│ • SANITY_ORGANIZATION_TOKEN                                 │
│ • SANITY_CONTEXT_MCP_URL                                    │
│ • AI_API_KEY / GEMINI_API_KEY                               │
│ • Private config validation (lib/config/env.ts)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ EXTERNAL CLOUD SERVICES                                     │
│ • Sanity Content Lake (https://api.sanity.io)               │
│ • Sanity Context MCP Server                                 │
│ • AI Provider API                                           │
└─────────────────────────────────────────────────────────────┘
```

**Key Security Invariants**:
1. **Never transmit secrets to the client**: `SANITY_ORGANIZATION_TOKEN` and AI API keys must never appear in client bundles or public HTTP responses.
2. **Never invoke Sanity mutations from unauthenticated client calls**: All modifications to Sanity schemas or datasets occur exclusively through authenticated Sanity Studio or admin CLI.
3. **No client-side MCP endpoints**: MCP connections are negotiated exclusively over server-side WebSockets/SSE.

---

## 5. Anti-Hallucination Mandate

1. **Grounded Invariant**: If a capability or network is not present in the retrieved Sanity documents, the system reports:
   `Status: Unknown / Unsupported` with an explicit notice, rather than generating an assumed answer.
2. **Mandatory Citation**: Every step in a verified implementation plan must cite at least one `sanityDocumentId` or rule code.
3. **Transparent Constraints**: All known constraints (rate limits, block time latency, gas estimation nuances) must be elevated to the developer with severity badges (`info`, `warning`, `blocking`).
