# API Architect — Sanity Context MCP Integration Specification

> **Protocol Standard**: Model Context Protocol (MCP) by Anthropic / Sanity.io  
> **Retrieval Layers**: GROQ Mode (Structured Records) + Knowledge Base Mode (Semantic Retrieval)  
> **Security Model**: Strict Server-Side Isolation (Zero Browser Secrets)  

---

## 1. Architecture & Security Boundary

In strict compliance with modern web application security principles, the Model Context Protocol connection is isolated on the Express backend server:

```text
┌───────────────────────────────────────────────┐
│ Browser / React SPA                           │
│  - No MCP credentials                         │
│  - No Sanity management tokens                │
│  - Zero API keys in client JavaScript bundle  │
└───────────────────────┬───────────────────────┘
                        │ HTTPS / POST /api/analyze
                        ▼
┌───────────────────────────────────────────────┐
│ Express API Server (server.ts)                │
│  - Validates user input                       │
│  - Rates & filters incoming requests          │
│  - Executes AgentOrchestrator                 │
└───────────────────────┬───────────────────────┘
                        │ Server-side Bearer Auth
                        ▼
┌───────────────────────────────────────────────┐
│ SanityContextService                          │
│  - Checks MCP health (GET /initial-context)   │
│  - Dispatches GROQ queries via /query         │
│  - Dispatches semantic search via /search     │
└───────────────────────┬───────────────────────┘
                        │ Model Context Protocol
                        ▼
┌───────────────────────────────────────────────┐
│ Hosted Sanity Context MCP                     │
│ https://context.sanity.io/v1/...              │
└───────────────────────────────────────────────┘
```

---

## 2. Environment Variables

Server-side configuration resides in `.env`:

```bash
# Sanity Project Identification
SANITY_PROJECT_ID="your_sanity_project_id"
SANITY_DATASET="production"
SANITY_API_VERSION="2026-03-01"

# Sanity Context MCP Endpoint & Token (Strictly Server-Side)
SANITY_CONTEXT_MCP_URL="https://context.sanity.io/v1/projects/your_sanity_project_id/datasets/production"
SANITY_CONTEXT_MCP_TOKEN="your_sanity_read_token_server_only"
```

---

## 3. Dual-Mode Operational Strategy

To ensure seamless local development, testing, and continuous integration without requiring live production Sanity organization tokens:

### Connected Mode (`LIVE_MCP`)
- Active when `SANITY_PROJECT_ID` and `SANITY_CONTEXT_MCP_TOKEN` are valid and reachable.
- Queries the hosted `https://context.sanity.io` endpoint directly over HTTPS/SSE.
- Emits provenance: `"LIVE_MCP (Sanity Context)"`.

### Development Fallback Mode (`LOCAL_FALLBACK`)
- Active when credentials are unconfigured, placeholder, or unreachable.
- Dispatches queries to `LocalSanityDatasetAdapter`, executing schema-aware filtering over the 159 validated documents in `scripts/seed/data/`.
- Emits provenance: `"LOCAL_FALLBACK (Controlled Sanity Dataset)"`.
- **Transparency Guarantee**: The UI and API responses explicitly state the active mode. No local fallback data is ever falsely represented as live remote MCP data.

---

## 4. MCP Health Endpoint (`GET /api/mcp/health`)

The health endpoint provides real-time diagnostics:

```json
{
  "configured": false,
  "connected": false,
  "mode": "LOCAL_FALLBACK",
  "status": "not_configured",
  "endpointUrl": "https://context.sanity.io/v1/unconfigured",
  "dataset": "production",
  "message": "Sanity Context MCP credentials are not configured. Operating in validated local dataset fallback mode.",
  "availableTools": ["groq_query (local adapter)", "search_knowledge (local adapter)"],
  "latencyMs": 0,
  "timestamp": "2026-09-26T15:24:38.000Z"
}
```

---

## 5. Automated Verification Suite

Run the combined MCP and fallback verification suite:

```bash
# Run 10 integration and unit assertions
npm run test:mcp
```

---

## 6. MCP Tools & Interaction Schemas

### GROQ Query Tool (`groq_query`)
- **Purpose**: Targeted retrieval over structured entities (`apiProduct`, `apiEndpoint`, `network`, `capability`, `compatibilityRule`, `constraint`).
- **Signature**:
  ```json
  {
    "query": "*[_type == 'apiProduct' && references($networkId)]",
    "params": { "networkId": "network.base" }
  }
  ```

### Knowledge Base Search Tool (`search_knowledge`)
- **Purpose**: Semantic vector search over prose documentation (`knowledgeDocument`, `implementationGuide`).
- **Signature**:
  ```json
  {
    "query": "how to verify webhook HMAC signatures in express",
    "limit": 5
  }
  ```
