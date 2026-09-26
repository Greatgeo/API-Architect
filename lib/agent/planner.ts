/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Implementation Planner Engine
 * Synthesizes grounded, actionable implementation blueprints from candidate evaluations,
 * verified endpoints, structured implementation guides, code examples, and operational constraints.
 */

import {
  ExtractedRequirements,
  CandidateEvaluation,
  ImplementationPlan,
  ImplementationPlanStep,
  RecommendedEndpoint,
  CodeSnippet,
  RiskOrLimitation,
} from './types.ts';
import { RetrievedContentSet } from './retrieve.ts';

export class ImplementationPlanner {
  /**
   * Constructs the verified implementation plan for the best candidate(s).
   */
  public static plan(
    req: ExtractedRequirements,
    candidates: CandidateEvaluation[],
    content: RetrievedContentSet
  ): ImplementationPlan {
    // 1. Select primary candidate(s)
    const validCandidates = candidates.filter(
      (c) => c.overallStatus === 'COMPATIBLE' || c.overallStatus === 'CONDITIONAL'
    );

    const selectedCandidates = validCandidates.map((c) => ({
      id: c.candidateId,
      name: c.candidateName,
      role: c.overallStatus === 'COMPATIBLE' ? 'Primary Data Provider' : 'Conditional Provider',
      justification: c.justification,
    }));

    const primaryCandidateId = validCandidates[0]?.candidateId;

    // 2. Select Endpoints
    const recommendedEndpoints: RecommendedEndpoint[] = [];
    const endpointsToInspect = primaryCandidateId
      ? content.endpoints.filter((ep: any) => ep.product?._ref === primaryCandidateId)
      : content.endpoints;

    for (const ep of endpointsToInspect) {
      recommendedEndpoints.push({
        id: ep._id,
        name: ep.name,
        method: ep.method,
        path: ep.path,
        purpose: ep.description || `Execute ${ep.method} request to ${ep.path}`,
        rateLimit: ep.rateLimit?.requestsPerMinute
          ? `${ep.rateLimit.requestsPerMinute} RPM`
          : undefined,
      });
    }

    // 3. Network Configurations
    const networkConfigurations = req.networks.map((rn) => {
      const netDoc = content.networks.find((n: any) => n._id === rn.id || n.slug?.current === rn.slug);
      return {
        name: netDoc ? netDoc.name : rn.name,
        chainId: netDoc?.chainId,
        environment: netDoc?.environment || 'mainnet',
        caveats:
          rn.slug === 'polygon'
            ? 'Deep re-org potential up to 64 blocks; wait for 128 block confirmations for finalized state.'
            : rn.slug === 'base'
            ? 'OP Stack Layer 2 block time is 2.0s with rapid state transitions and L1 batch posting.'
            : undefined,
      };
    });

    // 4. Authentication Guidance
    const authMethod = req.authentication[0]?.method || 'api_key';
    let authenticationGuidance = '';
    if (authMethod === 'api_key') {
      authenticationGuidance =
        'Store API keys strictly in server-side environment variables (.env). Never inject raw keys into React browser code (avoid VITE_ prefix for secrets). Route all external API calls through an Express backend proxy route (e.g. /api/*) that attaches the Authorization header.';
    } else if (authMethod === 'bearer') {
      authenticationGuidance =
        'Acquire short-lived Bearer tokens using server-to-server credentials. Forward Bearer tokens in Authorization: Bearer <token> headers.';
    } else {
      authenticationGuidance =
        'Implement delegated OAuth 2.0 PKCE flow or server-side secret negotiation.';
    }

    // 5. Rate Limit Strategy
    const minRps = req.minimumRateLimit || 10;
    const rateLimitStrategy = `The chosen provider supports up to ${
      validCandidates[0]?.throughputRps || minRps
    } requests per second. Implement client-side token bucket throttling and exponential backoff with full jitter on HTTP 429 responses. Cache static token metadata for at least 300 seconds to conserve quota.`;

    // 6. Conditions & Prerequisites
    const requiredConditions: string[] = [];
    for (const cand of validCandidates) {
      requiredConditions.push(...cand.conditions);
    }
    if (req.conditions.length > 0) {
      requiredConditions.push(...req.conditions);
    }

    // 7. Implementation Steps
    const implementationSteps: ImplementationPlanStep[] = [];
    const guide = content.implementationGuides[0];

    if (guide && Array.isArray(guide.steps) && guide.steps.length > 0) {
      guide.steps.forEach((step: any, idx: number) => {
        implementationSteps.push({
          stepNumber: idx + 1,
          title: step.title,
          description: step.description,
          codeSnippetId: step.codeExample?._ref,
        });
      });
    } else {
      // Standard robust sequence
      implementationSteps.push({
        stepNumber: 1,
        title: 'Provision API Credentials & Configure Server Environment',
        description:
          'Create API keys on the provider developer portal. Save keys in server-side environment variables (.env) and never expose them in browser bundles.',
      });
      implementationSteps.push({
        stepNumber: 2,
        title: 'Initialize Express Proxy Route & Headers',
        description:
          'Create server endpoint (e.g. /api/events) that injects Authorization headers and handles upstream rate-limiting headers.',
      });
      if (req.capabilities.some((c) => c.slug === 'webhook-notifications')) {
        implementationSteps.push({
          stepNumber: 3,
          title: 'Mount Webhook Receiver with Raw Body Parser',
          description:
            'Mount express.raw({ type: "application/json" }) to verify cryptographic HMAC-SHA256 signatures before processing payloads.',
        });
      }
      implementationSteps.push({
        stepNumber: implementationSteps.length + 1,
        title: 'Implement Exponential Backoff & Retry Logic',
        description:
          'Wrap requests in an exponential backoff loop with jitter to gracefully handle HTTP 429 (Too Many Requests) and network timeouts.',
      });
    }

    // 8. Code Examples
    const codeSnippets: CodeSnippet[] = [];
    for (const ex of content.codeExamples.slice(0, 3)) {
      codeSnippets.push({
        id: ex._id,
        title: ex.title,
        language: ex.language || 'typescript',
        code: ex.code,
        explanation: ex.explanation,
      });
    }

    // 9. Risks & Limitations
    const risksAndLimitations: RiskOrLimitation[] = [];
    for (const con of content.constraints.slice(0, 4)) {
      risksAndLimitations.push({
        title: con.name,
        severity: con.severity,
        mitigation: con.mitigation || con.description,
      });
    }

    // 10. Unresolved Unknowns
    const unresolvedUnknowns: string[] = [];
    for (const cand of candidates) {
      unresolvedUnknowns.push(...cand.unknowns);
    }
    unresolvedUnknowns.push(...req.unknownRequirements);

    // Dedup arrays
    const uniqueUnknowns = Array.from(new Set(unresolvedUnknowns));
    const uniqueConditions = Array.from(new Set(requiredConditions));

    // Architecture Overview
    let architectureOverview = '';
    if (validCandidates.length > 0) {
      const names = validCandidates.map((c) => c.candidateName).join(', ');
      architectureOverview = `Recommended architectural blueprint utilizing ${names} for verified multi-chain delivery across ${req.networks.map((n) => n.name).join(' and ')}. Includes secure server-side credential isolation, rate-limit backoff management, and verified response contracts.`;
    } else {
      architectureOverview =
        'No candidate in the current knowledge base satisfies all stated requirements simultaneously. Review the constraint matrix below to inspect the specific blocking limitations.';
    }

    return {
      architectureOverview,
      selectedCandidates,
      recommendedEndpoints,
      networkConfigurations,
      authenticationGuidance,
      rateLimitStrategy,
      requiredConditions: uniqueConditions,
      implementationSteps,
      codeSnippets,
      risksAndLimitations,
      unresolvedUnknowns: uniqueUnknowns,
    };
  }
}
