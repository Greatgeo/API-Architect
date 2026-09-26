# API Architect — Phase 1 Demonstration & Evaluation Script

This document provides step-by-step instructions for judges and evaluators to inspect and verify the **API Architect** Phase 1 deliverables.

---

## 1. Verifying System Health

### Test Health Endpoint
Execute in the terminal or browser:
```bash
curl -i http://localhost:3000/api/health
```

**Expected Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "status": "ok"
}
```

Verify that no server internals, private tokens, or filesystem paths are leaked.

---

## 2. Inspecting the User Interface

1. Open the application URL in a web browser.
2. Confirm the **Top Bar Contract**:
   - Single-element brand wordmark: **API Architect**
   - Clean navigation links (Architecture, Sanity Data Model, Domain Types, Roadmap)
   - Action controls (System Health, GitHub)
3. Confirm the **Hero Section & Value Proposition**:
   - Title: **API Architect**
   - Tagline: *"Turn a developer requirement into a verified API implementation plan."*
   - Clear identification of Path One: Ship an Agent That Queries Real Content.
4. Test the **Interactive Requirement Input**:
   - Click one of the sample prompt presets (e.g., *"Token transfer webhooks across Ethereum & Base to backend"*).
   - Notice the requirement textarea fills with the selected requirement.
   - Click **Analyze Requirement**.
   - Observe the **Honest Phase 1 Notice**:
     - Clarifies that AI analysis will be connected in Phase 5.
     - Outlines the 10-phase architecture roadmap.
     - Displays the extracted requirement preview and the verified domain types.
     - **No fake AI response or hallucinated solution is generated.**
5. Inspect the **Architecture Pipeline Visualization**:
   - Visualizes the 6-stage pipeline: Developer Prompt -> Server Orchestration -> Sanity Context MCP -> Sanity Content Lake -> Evidence & Constraint Reasoning -> Verified Implementation Plan.
6. Inspect the **Domain Model & Types Preview**:
   - Interactive tabbed viewer showcasing the TypeScript definitions for `ApiProduct`, `Network`, `Capability`, `Constraint`, `CompatibilityRule`, etc.

---

## 3. Codebase Verification

### Verify TypeScript Integrity
```bash
npm run lint
```
*Expected: 0 errors.*

### Verify Production Build
```bash
npm run build
```
*Expected: Successful bundle generation into `dist/`.*
