# API Architect

> **Turn a developer requirement into a verified API implementation plan.**

API Architect is an AI-powered developer tool built for the **Sanity Challenge 2026** under **Path One — Ship an Agent That Queries Real Content**.

Instead of treating AI as a generic chatbot that hallucinates API endpoints, parameters, and network compatibility, API Architect grounds developer plans in structured content stored in **Sanity Content Lake** and retrieved via **Sanity Context MCP**.

---

## Problem

Modern developers spend hours navigating fragmented API documentation, conflicting tutorials, and outdated blog posts. When developers use generic LLMs for architectural guidance, the models regularly:

1. **Hallucinate non-existent API parameters or endpoints**.
2. **Fail to identify network-specific limitations** (e.g. recommending WebSocket filters where only webhook delivery or polling is supported).
3. **Miss critical rate limits, re-org depths, or gas estimation subtleties**.
4. **Offer unverified sample code** that breaks in production or uses deprecated SDKs.

## Proposed Solution

API Architect transforms the workflow:

1. **Natural Language Requirement**: The developer describes their target architecture (e.g., *"I need to monitor token transfers on Ethereum and Base and send the events to my backend"*).
2. **Constraint & Goal Extraction**: The system parses technical objectives, required networks, delivery protocols, and throughput expectations.
3. **Structured Knowledge Retrieval via Sanity Context MCP**: The reasoning engine queries Sanity Content Lake for relevant API products, endpoints, networks, capabilities, and constraints.
4. **Evidence & Compatibility Reasoning**: The engine evaluates real compatibility rules and flags conflicts or unsupported configurations without hallucinating.
5. **Verified Implementation Plan**: The developer receives a battle-tested blueprint complete with verified code snippets, step-by-step instructions, and direct citations to authoritative Sanity content.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend / API**: Express 4, TypeScript, Next.js App Router specification
- **Content Lake (Phases 2–3)**: Sanity Studio v3, Sanity Content Lake, GROQ
- **Retrieval Layer (Phase 4)**: Sanity Context MCP (Model Context Protocol)
- **Reasoning Engine (Phase 5)**: AI Agent with grounded constraint checking
- **Runtime Environment**: Node.js 22 LTS, Vite 8, tsx

---

## Architecture Overview

```
Developer Prompt
       │
       ▼
React / UI Layer (Client Interface)
       │
       ▼ HTTPS / JSON (Zero Browser Secrets)
Express API Server (/api/health, /api/architect)
       │
       ▼ Server-side Authenticated MCP
Sanity Context MCP
       │
       ▼ GROQ / Graph Queries
Sanity Content Lake + Knowledge Base
  (Products, Endpoints, Capabilities, Constraints, Rules)
       │
       ▼
Evidence & Compatibility Reasoning
       │
       ▼
Verified Implementation Plan with Grounded Citations
```

For complete architectural details, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).  
For the planned content model, see [`docs/SANITY_SCHEMA.md`](docs/SANITY_SCHEMA.md).

---

## Why Sanity is Central to API Architect

Generic LLM developer tools hallucinate non-existent API parameters, invent endpoints, and fail to identify network-specific limitations (such as recommending WebSocket filters where only webhook delivery or polling is supported).

**API Architect places Sanity at the center of the application's intelligence**:
- **Structured Knowledge Graph**: API products, endpoints, networks, capabilities, and compatibility rules are modeled as distinct, interconnected Sanity document types rather than flat prose.
- **Relational Integrity**: Directional references connect capabilities to constraints, networks, and implementation guides, allowing graph-aware querying.
- **Ground Truth for Context MCP**: In upcoming phases, Sanity Context MCP will query this structured schema directly, ensuring the AI agent reasons exclusively over verified content.
- **Zero Hallucination**: Unsupported networks or contradictory requirements are explicitly detected through Sanity compatibility rules rather than assumed or synthesized.

---

## Development Status

```text
Phase 1 — Architecture & Project Foundation
Status: Complete

Phase 2 — Sanity Studio & Structured Content Schema
Status: Complete
```

*Note: Phase 2 establishes the production-grade Sanity Studio, document schemas, and schema validation. In accordance with competition rules, no mock seed dataset or fake AI/MCP connections are claimed.*

---

## Future Phases

- **Phase 1 — Architecture & Project Foundation** *(Complete)*
- **Phase 2 — Sanity Studio & Structured Content Schema** *(Complete)*
- **Phase 3 — Demo Knowledge Base & Seed Data**
- **Phase 4 — Sanity Context MCP**
- **Phase 5 — AI Agent**
- **Phase 6 — Frontend**
- **Phase 7 — Integration**
- **Phase 8 — Testing**
- **Phase 9 — Deployment**
- **Phase 10 — Competition Submission**

---

## Local Development

### Prerequisites

- Node.js 20+ or 22+
- npm 10+

### Installation

```bash
# Clone the repository and install dependencies
npm install
```

### Environment Setup

```bash
# Copy example environment configuration
cp .env.example .env
```

### Starting the Development Server

```bash
# Starts the full-stack server (Express + Vite) on port 3000
npm run dev
```

### Sanity Studio Commands

```bash
# Validate all Sanity schemas in workspace (0 errors / 0 warnings)
npm run studio:validate

# Build the Sanity Studio static bundle into studio/dist
npm run studio:build

# Launch Sanity Studio locally (standalone dev server)
npm run studio:dev
```

### Dataset & Seed Commands (Phase 3)

```bash
# Validate seed dataset integrity (159 documents, 557 references)
npm run seed:validate

# Export seed data to NDJSON files for Sanity import
npm run seed:export

# Run ground-truth compatibility & constraint benchmark (8/8 scenarios)
npm run test:dataset

# Run combined validation and benchmark suite
npm run dataset:check
```

### Agent Verification & Testing (Phases 4A & 4B)

```bash
# Run the 8 ground-truth benchmark scenarios through the full Agent pipeline
npm run test:agent

# Run the 10 MCP integration and transparent fallback tests
npm run test:mcp

# Check Sanity Context MCP connection health
curl http://localhost:3000/api/mcp/health

# Analyze a developer requirement via the agent endpoint
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"requirement": "I need an API for Ethereum and Base with token transfer events"}'
```

See [docs/LIVE_SANITY_VERIFICATION.md](docs/LIVE_SANITY_VERIFICATION.md) for the live vs. local verification record.

### Accessing the Studio

Once the server is running, the compiled Sanity Studio can be inspected at:
```
http://localhost:3000/studio
```

### Type Checking & Linting

```bash
# Run TypeScript compilation check
npm run lint
```

### Building for Production

```bash
# Build the production bundle
npm run build
```

### Health Check

Once the server is running, verify system health:

```bash
curl http://localhost:3000/api/health
# Response: {"status":"ok"}
```
