# API Architect — Sanity Studio Structured Content Model (Phase 2 Specification)

> **Document Status**: Production Schema Implemented & Validated  
> **Sanity CLI**: `@sanity/cli 8.13.0` | **Sanity Core**: `sanity 6.16.0`  
> **Validation Status**: `0 Errors`, `0 Warnings` via `sanity schemas validate`  
> **Path**: Sanity Challenge 2026 — Path One: Ship an Agent That Queries Real Content  

---

## 1. Executive Summary

API Architect turns natural language developer requirements into verified API implementation plans. To prevent the hallucinations, broken parameter inventions, and unsupported network assumptions typical of ungrounded LLMs, API Architect grounds its reasoning in structured content authored and maintained in **Sanity Studio v3**.

The Sanity Content Lake serves as the **authoritative single source of truth** for:
- API Products, endpoints, and authentication schemes
- Blockchain networks, layer-2 protocols, and environment limits
- Technical capabilities (e.g. token transfer webhooks, gas estimation, balance streaming)
- Deterministic compatibility rules (compatible, conditional, incompatible)
- Operational constraints and severity levels (info, warning, blocking)
- Implementation guides, step-by-step instructions, and verified code examples

---

## 2. Entity Relationship Diagram

```
                              ┌──────────────────┐
                              │    Technology    │
                              └────────┬─────────┘
                                       │
                                       ▼
┌──────────────────┐          ┌──────────────────┐
│   API Product    │─────────▶│   API Endpoint   │
└────────┬─────────┘          └────────┬─────────┘
         │                             │
         │                             ▼
         │                    ┌──────────────────┐
         └───────────────────▶│    Capability    │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │     Network      │
                              └──────────────────┘

        ▲                              ▲
        │                              │
┌───────┴──────────┐          ┌────────┴─────────┐
│Compatibility Rule│          │    Constraint    │
│ (Multi-Variable) │          │(Severity Guard)  │
└───────┬──────────┘          └──────────────────┘
        │
        ▼
┌──────────────────┐          ┌──────────────────┐
│Implement. Guide  │─────────▶│   Code Example   │
│  (Steps/Trouble) │          │(Verified Snippet)│
└──────────────────┘          └──────────────────┘
```

---

## 3. Reusable Object Types

These structured objects are modularly embedded into documents to avoid data redundancy and maintain editorial clarity.

| Object Type | Key Fields | Purpose | AI Reasoning Usage |
|:---|:---|:---|:---|
| **`limitation`** | `title`, `description`, `severity` (`info`/`warning`/`blocking`) | Captures quirks, re-org caveats, or operational limits. | Reasoner flags blocking vs warning caveats before proposing an architecture. |
| **`parameter`** | `name`, `type`, `required`, `description`, `example` | Documents API request parameters and headers. | Validates whether developer's requested payload matches API endpoint contracts. |
| **`responseField`** | `name`, `type`, `description` | Structured output schema fields. | Informs developer what data fields are returned (e.g. `blockNumber`, `txHash`). |
| **`rateLimit`** | `requests`, `window`, `scope`, `description` | Defines requests allowed per time unit. | Flags throughput conflicts if developer asks for high-frequency polling. |
| **`requirement`** | `name`, `type`, `description` | Infrastructure/auth requirements. | Populates prerequisite checklist in final implementation plan. |
| **`condition`** | `title`, `description`, `isMandatory` | Conditions required for conditional compatibility. | Synthesizes explicit caveats (e.g., "Requires webhook endpoint with TLS"). |
| **`conflict`** | `title`, `description`, `workaround` | Incompatible architectural choices. | Generates clear "Why this is incompatible" explanations without guessing. |
| **`implementationStep`** | `order`, `title`, `description` | Ordered implementation steps. | Emitted as sequential tasks in the verified plan. |
| **`commonProblem`** | `problem`, `cause`, `solution` | Edge-case troubleshooting items. | Injected into edge-case advisory cards. |

---

## 4. Document Types Specification

### 4.1 `apiProduct`
* **Purpose**: Represents an API product offering in the knowledge base (e.g. *Atlas Webhook Gateway*).
* **Fields**:
  - `name` (String, Required): Formal product title. *(Structured reasoning)*
  - `slug` (Slug, Required): URL-safe identifier. *(Query key)*
  - `provider` (String, Required): Organization or provider name. *(Structured filtering)*
  - `description` (Text): High-level overview. *(Explanatory prose)*
  - `category` (String, Controlled List: `blockchain`, `wallet`, `data`, `analytics`, `payments`, `identity`, `infrastructure`, `developer-tools`, `other`): Domain category. *(Filtering)*
  - `status` (String, Controlled: `active`, `beta`, `deprecated`, `experimental`): Lifecycle status. Deprecated products are excluded from primary recommendations. *(Constraint reasoning)*
  - `currentVersion` (String): e.g. "v1.4.0". *(Version checking)*
  - `documentationUrl` (URL): Authoritative link. *(Citations)*
  - `authenticationMethods` (Array of Strings: `api_key`, `bearer`, `oauth`, `webhook_secret`, `none`, `other`): Auth types accepted. *(Auth compatibility)*
  - `supportedNetworks` (Array of References $\rightarrow$ `network`): Supported blockchain environments. *(Network matching)*
  - `capabilities` (Array of References $\rightarrow$ `capability`): Capabilities this product provides. *(Goal mapping)*
  - `limitations` (Array of `limitation` objects): Known product-level caveats. *(Warning synthesis)*

### 4.2 `apiEndpoint`
* **Purpose**: A specific HTTP/RPC route under an API product.
* **Fields**:
  - `name` (String, Required): e.g. "Create Webhook Subscription". *(Label)*
  - `slug` (Slug, Required): Unique slug. *(Query key)*
  - `product` (Reference $\rightarrow$ `apiProduct`, Required): Parent product. *(Relational traversal)*
  - `method` (String, Controlled: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`): HTTP verb. *(Code generation)*
  - `path` (String, Required): e.g. `/v1/subscriptions`. *(Code generation)*
  - `description` (Text): Endpoint purpose. *(Explanatory prose)*
  - `authentication` (Array of Strings): Auth headers required for this route. *(Prerequisites)*
  - `parameters` (Array of `parameter` objects): Query, path, and body params. *(Payload synthesis)*
  - `responseSchema` (Object with `summary` and `fields` array of `responseField`): Payload structure. *(Output description)*
  - `capabilities` (Array of References $\rightarrow$ `capability`): Capabilities fulfilled. *(Matching)*
  - `supportedNetworks` (Array of References $\rightarrow$ `network`): Active networks. *(Matching)*
  - `rateLimit` (`rateLimit` object): Throttle caps. *(Feasibility verification)*
  - `limitations` (Array of `limitation` objects): Route-specific constraints. *(Edge-case warnings)*
  - `relatedEndpoints` (Array of References $\rightarrow$ `apiEndpoint`): Complementary routes. *(Guide chaining)*
  - `codeExamples` (Array of References $\rightarrow$ `codeExample`): Working snippets. *(Plan delivery)*
  - `documentationUrl` (URL): Direct route docs. *(Citations)*

### 4.3 `network`
* **Purpose**: Target execution environment (EVM, L2, sidechain).
* **Fields**:
  - `name` (String, Required): e.g. "Ethereum Mainnet", "Base". *(Label)*
  - `slug` (Slug, Required): Normalized slug. *(Query key)*
  - `type` (String, Controlled: `evm`, `non_evm`, `layer2`, `sidechain`, `other`): Architecture class. *(Protocol rules)*
  - `chainId` (String): e.g. "1", "8453". *(Config injection)*
  - `environment` (String, Controlled: `mainnet`, `testnet`, `devnet`, `other`): Target stage. *(Deployment filtering)*
  - `supportedCapabilities` (Array of References $\rightarrow$ `capability`): Validated features. *(Compatibility checking)*
  - `limitations` (Array of `limitation` objects): e.g. Re-org depths, sequencer latency. *(Warning generation)*
  - `documentationUrl` (URL): Network docs. *(Citations)*

### 4.4 `capability`
* **Purpose**: Atomic functional feature that a developer seeks to achieve.
* **Fields**:
  - `name` (String, Required): Normalized capability ID (e.g. `token_transfer_events`). *(Agent goal matching)*
  - `slug` (Slug, Required): Unique identifier. *(Query key)*
  - `description` (Text, Required): What this capability achieves. *(Explanatory prose)*
  - `category` (String, Controlled: `wallet`, `transaction`, `token`, `nft`, `events`, `rpc`, `analytics`, `webhooks`, `portfolio`, `other`): Semantic category. *(Classification)*
  - `requirements` (Array of `requirement` objects): Prerequisites. *(Checklist generation)*
  - `supportedNetworks` (Array of References $\rightarrow$ `network`): Networks supporting this capability. *(Cross-chain verification)*
  - `compatibleEndpoints` (Array of References $\rightarrow$ `apiEndpoint`): Endpoints that deliver this capability. *(Route selection)*
  - `limitations` (Array of `limitation` objects): Specific operational restrictions. *(Constraint reasoning)*
  - `relatedCapabilities` (Array of References $\rightarrow$ `capability`): Synergistic capabilities. *(Recommendation expansion)*

### 4.5 `compatibilityRule`
* **Purpose**: Explicit, multi-variable logic governing when components can function together.
* **Fields**:
  - `name` (String, Required): Descriptive rule name (e.g. "Base L2 + WebSocket Subscriptions"). *(Label)*
  - `itemA` (Reference $\rightarrow$ `apiProduct` / `apiEndpoint` / `network` / `capability` / `technology`, Required): First entity. *(Graph relation)*
  - `itemB` (Reference $\rightarrow$ `apiProduct` / `apiEndpoint` / `network` / `capability` / `technology`, Required): Second entity. *(Graph relation)*
  - `status` (String, Controlled: `compatible`, `conditional`, `incompatible`, `unknown`, Required): Verified outcome. *(Deterministic status assignment)*
  - `conditions` (Array of `condition` objects): Required conditions if status is `conditional`. *(Caveat enforcement)*
  - `requirements` (Array of `requirement` objects): Architectural demands. *(Step requirements)*
  - `conflicts` (Array of `conflict` objects): Direct protocol contradictions. *(Conflict explanation)*
  - `explanation` (Text, Required): Grounded justification of WHY. *(Anti-hallucination rationale)*
  - `source` (String, Required): Source attribution (e.g. "Controlled demo dataset"). *(Auditability)*

### 4.6 `constraint`
* **Purpose**: Architectural guardrails affecting implementation choices.
* **Fields**:
  - `name` (String, Required): Summary of limitation. *(Badge label)*
  - `type` (String, Controlled: `network`, `runtime`, `authentication`, `rate_limit`, `version`, `deployment`, `feature`, `security`, `other`): Classification. *(Filtering)*
  - `severity` (String, Controlled: `info`, `warning`, `blocking`, Required): Impact severity. *(Agent veto power)*
  - `description` (Text, Required): What happens when triggered. *(Explanatory prose)*
  - `appliesTo` (Array of References $\rightarrow$ `apiProduct` / `apiEndpoint` / `network` / `capability` / `technology`): Impacted entities. *(Context lookup)*
  - `condition` (Text): Trigger situation. *(Logic evaluation)*
  - `workaround` (Text): Engineering solution. *(Actionable advice)*
  - `source` (String): Document source. *(Auditability)*

### 4.7 `implementationGuide`
* **Purpose**: Structured step-by-step developer implementation recipes.
* **Fields**:
  - `title` (String, Required): Guide title. *(Headline)*
  - `slug` (Slug, Required): Unique slug. *(Query key)*
  - `summary` (Text, Required): High-level overview. *(Intro text)*
  - `technology` (Reference $\rightarrow$ `technology`, Required): Target stack. *(Stack filtering)*
  - `prerequisites` (Array of Strings): Required dependencies. *(Prerequisite list)*
  - `steps` (Array of `implementationStep` objects, Required): Ordered sequence of actions. *(Task list)*
  - `commonProblems` (Array of `commonProblem` objects): Troubleshooting guide. *(Advisory notes)*
  - `relatedEndpoints` (Array of References $\rightarrow$ `apiEndpoint`): Invoked endpoints. *(References)*
  - `relatedCapabilities` (Array of References $\rightarrow$ `capability`): Addressed capabilities. *(Goal matching)*
  - `source` (String): Document origin. *(Auditability)*

### 4.8 `codeExample`
* **Purpose**: Production-ready, verified code snippets.
* **Fields**:
  - `title` (String, Required): Snippet title. *(Tab label)*
  - `language` (String, Controlled: `typescript`, `javascript`, `python`, `php`, `curl`, `other`, Required): Syntax language. *(Highlighter)*
  - `framework` (String): e.g. "Express 4", "Next.js App Router". *(Tech badge)*
  - `endpoint` (Reference $\rightarrow$ `apiEndpoint`): Associated endpoint. *(Route mapping)*
  - `description` (Text): Usage notes. *(Explanatory prose)*
  - `code` (Text, Required): Raw code. *(Clipboard copy / code viewer)*
  - `prerequisites` (Array of Strings): Setup packages. *(Dependency install instructions)*
  - `relatedCapabilities` (Array of References $\rightarrow$ `capability`): Related features. *(Matching)*

### 4.9 `technology`
* **Purpose**: Represents developer programming languages, frameworks, and deployment runtimes.
* **Fields**:
  - `name` (String, Required): e.g. "TypeScript", "Node.js", "Express", "Next.js". *(Match target)*
  - `slug` (Slug, Required): Unique slug. *(Query key)*
  - `category` (String, Controlled: `language`, `framework`, `runtime`, `cloud`, `library`, `database`, `other`, Required): Stack layer. *(Filtering)*
  - `version` (String): Supported version ranges. *(Constraint check)*
  - `runtime` (String): Underlying engine (e.g. "Node 22", "Edge Worker"). *(Serverless check)*
  - `deploymentTargets` (Array of Strings): e.g. "Vercel", "AWS ECS", "Cloud Run". *(Compatibility check)*
  - `supportedFeatures` (Array of Strings): e.g. "WebSockets", "Streaming". *(Feature check)*
  - `limitations` (Array of `limitation` objects): Known framework limits. *(Caveat warnings)*
  - `documentationUrl` (URL): Official docs. *(Citations)*

### 4.10 `knowledgeDocument`
* **Purpose**: Long-form architectural guidance, selection criteria, security protocols, and troubleshooting recipes intended for semantic search and Sanity Knowledge Base indexing.
* **Fields**:
  - `title` (String, Required): Guide title. *(Search headline)*
  - `slug` (Slug, Required): Unique slug identifier. *(Query key)*
  - `category` (String, Controlled: `architecture`, `selection`, `protocols`, `security`, `troubleshooting`, `integration`, Required): Knowledge category. *(Filtering)*
  - `summary` (Text, Required): Executive concept summary. *(Semantic embedding)*
  - `content` (Text, Required): Markdown prose explaining nuances, trade-offs, and failure remediation. *(Knowledge Base text)*
  - `topics` (Array of Strings): Semantic tags (e.g. `webhooks`, `base-l2`, `re-org`). *(Keyword matching)*
  - `relatedCapabilities` (Array of References $\rightarrow$ `capability`): Related capabilities. *(Graph link)*
  - `relatedNetworks` (Array of References $\rightarrow$ `network`): Related networks. *(Graph link)*
  - `relatedProducts` (Array of References $\rightarrow$ `apiProduct`): Referenced API products. *(Graph link)*
  - `relatedTechnologies` (Array of References $\rightarrow$ `technology`): Referenced tools. *(Graph link)*
  - `source` (String, Required): Provenance notice (Default: `Controlled demo dataset - Architectural Guidance`).
  - `isControlledDemo` (Boolean, Default: `true`): Controlled dataset flag.

---

## 5. Schema Quality & Concept Query Validation (Section 26)

The schema was verified against the three conceptual reasoning scenarios from Section 26:

### Scenario 1: *"Find API endpoints that support token transfer events on Ethereum."*
* **GROQ Retrieval**:
  ```groq
  *[_type == "apiEndpoint" &&
    references(*[_type == "capability" && name == "token_transfer_events"]._id) &&
    references(*[_type == "network" && name match "*Ethereum*"]._id)] {
    name,
    method,
    path,
    "product": product-> { name, provider },
    "rateLimit": rateLimit,
    "codeExamples": codeExamples[]-> { title, language, code }
  }
  ```
* **Supported by Schema**: Yes. Directly matches `apiEndpoint.capabilities` and `apiEndpoint.supportedNetworks`.

### Scenario 2: *"Find APIs that support both Ethereum and Base."*
* **GROQ Retrieval**:
  ```groq
  *[_type == "apiProduct" &&
    references(*[_type == "network" && name match "*Ethereum*"]._id) &&
    references(*[_type == "network" && name match "*Base*"]._id)] {
    name,
    provider,
    status,
    capabilities[]-> { name, category },
    limitations
  }
  ```
* **Supported by Schema**: Yes. Directly matches `apiProduct.supportedNetworks` containing both network IDs.

### Scenario 3: *"Find capabilities available on Base that have a blocking limitation for webhook delivery."*
* **GROQ Retrieval**:
  ```groq
  *[_type == "capability" &&
    category == "webhooks" &&
    references(*[_type == "network" && name match "*Base*"]._id) &&
    (
      count(limitations[severity == "blocking"]) > 0 ||
      count(*[_type == "constraint" && severity == "blocking" && references(^._id)]) > 0
    )] {
    name,
    description,
    "blockingLimitations": limitations[severity == "blocking"],
    "blockingConstraints": *[_type == "constraint" && severity == "blocking" && references(^._id)] {
      name,
      description,
      workaround
    }
  }
  ```
* **Supported by Schema**: Yes. Cross-references `capability.supportedNetworks`, `capability.limitations[severity == 'blocking']`, and `constraint.appliesTo`.
