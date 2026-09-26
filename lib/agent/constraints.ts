/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Deterministic Constraint Evaluation Engine
 * Evaluates candidates against multi-variable constraints: networks, capabilities,
 * authentication methods, throughput limits, and compatibility rules.
 * Enforces the core four-state epistemic model: COMPATIBLE, CONDITIONAL, INCOMPATIBLE, UNKNOWN.
 */

import {
  ExtractedRequirements,
  CandidateEvaluation,
  ConstraintEvaluation,
  FourStateStatus,
} from './types.ts';
import { RetrievedContentSet } from './retrieve.ts';

// Documented rate limits per controlled candidate product
const PRODUCT_THROUGHPUT_MAP: Record<string, number> = {
  'product.northstar-data': 10,
  'product.aster-wallet': 25,
  'product.orbit-event': 50,
  'product.solis-solana': 30,
  'product.helios-rpc': 100,
  'product.nexus-portfolio': 15,
  'product.quanta-indexer': 20,
  'product.strata-pay': 10,
  'product.beacon-identity': 15,
  'product.vanguard-gas': 50,
  'product.zenith-activity': 20,
};

export class ConstraintEvaluator {
  /**
   * Evaluates all candidates against the user's extracted requirements.
   */
  public static evaluate(
    req: ExtractedRequirements,
    content: RetrievedContentSet
  ): {
    candidates: CandidateEvaluation[];
    constraintMatrix: ConstraintEvaluation[];
  } {
    const candidateEvaluations: CandidateEvaluation[] = [];
    const allMatrixRows: ConstraintEvaluation[] = [];

    // Helper to find a compatibility rule between two items
    const findRule = (itemAId: string, itemBId: string) => {
      return content.compatibilityRules.find((r: any) => {
        const a = r.itemA?._ref;
        const b = r.itemB?._ref;
        return (a === itemAId && b === itemBId) || (a === itemBId && b === itemAId);
      });
    };

    const formatConditions = (conds: any[]): string => {
      return (conds || [])
        .map((c: any) =>
          typeof c === 'string'
            ? c
            : c.description
            ? `${c.title}: ${c.description}`
            : c.title || ''
        )
        .filter(Boolean)
        .join('; ');
    };

    for (const prod of content.products) {
      const prodId = prod._id;
      const prodName = prod.name;
      const supportedNetRefs: string[] = (prod.supportedNetworks || []).map((ref: any) => ref._ref);
      const capRefs: string[] = (prod.capabilities || []).map((ref: any) => ref._ref);
      const authMethods: string[] = prod.authenticationMethods || [];
      const throughputRps = PRODUCT_THROUGHPUT_MAP[prodId] ?? 10;

      const evaluations: ConstraintEvaluation[] = [];
      const conditions: string[] = [];
      const conflicts: string[] = [];
      const unknowns: string[] = [];
      const matchingCaps: string[] = [];

      // 1. Evaluate Networks
      for (const net of req.networks) {
        const netId = net.id;
        const netName = net.name;
        const rule = findRule(prodId, netId);

        let status: FourStateStatus = 'UNKNOWN';
        let evidenceSnippet = '';
        let condition: string | undefined;
        let conflictReason: string | undefined;

        if (rule) {
          if (rule.status === 'compatible') {
            status = 'COMPATIBLE';
            evidenceSnippet = rule.explanation || `Explicit compatibility verified for ${netName}.`;
          } else if (rule.status === 'conditional') {
            status = 'CONDITIONAL';
            condition = formatConditions(rule.conditions);
            evidenceSnippet = rule.explanation || `Conditional support for ${netName}.`;
            if (condition) conditions.push(`${netName}: ${condition}`);
          } else if (rule.status === 'incompatible') {
            status = 'INCOMPATIBLE';
            const msg = rule.explanation || `Incompatible with ${netName}.`;
            conflictReason = msg;
            evidenceSnippet = msg;
            conflicts.push(`${netName}: ${msg}`);
          } else if (rule.status === 'unknown') {
            status = 'UNKNOWN';
            evidenceSnippet =
              rule.explanation || `Insufficient evidence documented for ${netName} support.`;
            unknowns.push(`${netName}: ${evidenceSnippet}`);
          }
        } else if (supportedNetRefs.includes(netId)) {
          status = 'COMPATIBLE';
          evidenceSnippet = `${prodName} documents native support for ${netName}.`;
        } else {
          // Check cross-ecosystem incompatibility (e.g. Solana API for EVM, or EVM API for Solana)
          const isProdSolanaOnly = prodId === 'product.solis-solana';
          const isNetSolana = netId === 'network.solana';

          if (isProdSolanaOnly && !isNetSolana) {
            status = 'INCOMPATIBLE';
            conflictReason = `${prodName} is an SVM/Solana-specialized API and does not support EVM ${netName}.`;
            evidenceSnippet = conflictReason;
            conflicts.push(`${netName}: ${conflictReason}`);
          } else if (!isProdSolanaOnly && isNetSolana) {
            status = 'INCOMPATIBLE';
            conflictReason = `${prodName} is an EVM API and cannot process Solana accounts or transactions.`;
            evidenceSnippet = conflictReason;
            conflicts.push(`${netName}: ${conflictReason}`);
          } else {
            // Not in supported networks list and no rule exists
            // Distinguish whether candidate is generally incompatible with this network or unknown
            if (
              prodId === 'product.northstar-data' &&
              (netId === 'network.base' || netId === 'network.solana')
            ) {
              status = 'INCOMPATIBLE';
              conflictReason = `${prodName} explicitly does not support ${netName}.`;
              evidenceSnippet = conflictReason;
              conflicts.push(`${netName}: ${conflictReason}`);
            } else if (prodId === 'product.northstar-data' && netId === 'network.avalanche') {
              status = 'UNKNOWN';
              evidenceSnippet = `The controlled dataset does not contain documented evidence regarding ${prodName} on Avalanche.`;
              unknowns.push(`${netName}: ${evidenceSnippet}`);
            } else {
              status = 'INCOMPATIBLE';
              conflictReason = `${prodName} does not list ${netName} among supported networks.`;
              evidenceSnippet = conflictReason;
              conflicts.push(`${netName}: ${conflictReason}`);
            }
          }
        }

        const evalItem: ConstraintEvaluation = {
          id: `eval-${prodId}-${netId}`,
          requirementKey: `network:${net.slug}`,
          requirementLabel: `Network: ${netName}`,
          candidateId: prodId,
          candidateName: prodName,
          status,
          evidenceSnippet,
          condition,
          conflictReason,
          supportingEvidenceId: rule ? `ev-rule-${rule._id}` : `ev-prod-${prodId}`,
        };

        evaluations.push(evalItem);
        allMatrixRows.push(evalItem);
      }

      // 2. Evaluate Capabilities
      for (const cap of req.capabilities) {
        const capId = cap.id;
        const capName = cap.name;
        const rule = findRule(prodId, capId);

        let status: FourStateStatus = 'UNKNOWN';
        let evidenceSnippet = '';
        let condition: string | undefined;
        let conflictReason: string | undefined;

        if (rule) {
          if (rule.status === 'compatible') {
            status = 'COMPATIBLE';
            evidenceSnippet = rule.explanation || `Compatible with ${capName}.`;
            matchingCaps.push(capName);
          } else if (rule.status === 'conditional') {
            status = 'CONDITIONAL';
            condition = formatConditions(rule.conditions);
            evidenceSnippet = rule.explanation || `Conditional support for ${capName}.`;
            matchingCaps.push(capName);
            if (condition) conditions.push(`${capName}: ${condition}`);
          } else if (rule.status === 'incompatible') {
            status = 'INCOMPATIBLE';
            const msg = rule.explanation || `Incompatible with ${capName}.`;
            conflictReason = msg;
            evidenceSnippet = msg;
            conflicts.push(`${capName}: ${msg}`);
          } else {
            status = 'UNKNOWN';
            evidenceSnippet = rule.explanation || `Unknown support for ${capName}.`;
            unknowns.push(`${capName}: ${evidenceSnippet}`);
          }
        } else if (capRefs.includes(capId)) {
          // Check if webhook capability requires conditional setup
          if (cap.slug === 'webhook-notifications') {
            status = 'CONDITIONAL';
            condition = 'Active webhook subscription registration & public HTTPS TLS endpoint required';
            evidenceSnippet = `${prodName} supports webhook push callbacks conditioned upon endpoint registration.`;
            matchingCaps.push(capName);
            conditions.push(condition);
          } else {
            status = 'COMPATIBLE';
            evidenceSnippet = `${prodName} provides documented support for ${capName}.`;
            matchingCaps.push(capName);
          }
        } else {
          // Check if endpoints provide it
          const endpointMatches = content.endpoints.some(
            (ep: any) =>
              ep.product?._ref === prodId &&
              (ep.capabilities || []).some((r: any) => r._ref === capId)
          );

          if (endpointMatches) {
            status = 'COMPATIBLE';
            evidenceSnippet = `${prodName} endpoints provide ${capName}.`;
            matchingCaps.push(capName);
          } else {
            status = 'INCOMPATIBLE';
            conflictReason = `${prodName} does not provide capability '${capName}'.`;
            evidenceSnippet = conflictReason;
            conflicts.push(`${capName}: ${conflictReason}`);
          }
        }

        const evalItem: ConstraintEvaluation = {
          id: `eval-${prodId}-${cap.slug}`,
          requirementKey: `capability:${cap.slug}`,
          requirementLabel: `Capability: ${capName}`,
          candidateId: prodId,
          candidateName: prodName,
          status,
          evidenceSnippet,
          condition,
          conflictReason,
          supportingEvidenceId: rule ? `ev-rule-${rule._id}` : `ev-prod-${prodId}`,
        };

        evaluations.push(evalItem);
        allMatrixRows.push(evalItem);
      }

      // 3. Evaluate Authentication
      for (const auth of req.authentication) {
        const authMethod = auth.method;
        const authLabel = auth.label;
        const isSupported = authMethods.includes(authMethod);

        const status: FourStateStatus = isSupported ? 'COMPATIBLE' : 'INCOMPATIBLE';
        const evidenceSnippet = isSupported
          ? `${prodName} supports authentication method '${authMethod}' (${authMethods.join(', ')}).`
          : `${prodName} does not support '${authMethod}'. Available: ${authMethods.join(', ')}.`;

        const conflictReason = isSupported ? undefined : `Missing required '${authMethod}' auth`;
        if (conflictReason) conflicts.push(`Auth: ${conflictReason}`);

        const evalItem: ConstraintEvaluation = {
          id: `eval-${prodId}-auth-${authMethod}`,
          requirementKey: `auth:${authMethod}`,
          requirementLabel: `Authentication: ${authLabel}`,
          candidateId: prodId,
          candidateName: prodName,
          status,
          evidenceSnippet,
          conflictReason,
          supportingEvidenceId: `ev-prod-${prodId}`,
        };

        evaluations.push(evalItem);
        allMatrixRows.push(evalItem);
      }

      // 4. Evaluate Rate Limit
      if (req.minimumRateLimit !== null) {
        const requiredRps = req.minimumRateLimit;
        const isSatisfied = throughputRps >= requiredRps;
        const status: FourStateStatus = isSatisfied ? 'COMPATIBLE' : 'INCOMPATIBLE';

        const evidenceSnippet = isSatisfied
          ? `${prodName} throughput of ${throughputRps} RPS meets requested minimum of ${requiredRps} RPS.`
          : `${prodName} throughput limit is ${throughputRps} RPS, which fails requested minimum of ${requiredRps} RPS.`;

        const conflictReason = isSatisfied
          ? undefined
          : `Throughput limit (${throughputRps} RPS) < requested minimum (${requiredRps} RPS)`;
        if (conflictReason) conflicts.push(`Rate Limit: ${conflictReason}`);

        const evalItem: ConstraintEvaluation = {
          id: `eval-${prodId}-rps`,
          requirementKey: 'limit:throughput',
          requirementLabel: `Throughput: >= ${requiredRps} RPS`,
          candidateId: prodId,
          candidateName: prodName,
          status,
          evidenceSnippet,
          conflictReason,
          supportingEvidenceId: `ev-prod-${prodId}`,
        };

        evaluations.push(evalItem);
        allMatrixRows.push(evalItem);
      }

      // Synthesize overall candidate status
      let overallStatus: FourStateStatus = 'COMPATIBLE';
      if (evaluations.some((e) => e.status === 'INCOMPATIBLE')) {
        overallStatus = 'INCOMPATIBLE';
      } else if (evaluations.some((e) => e.status === 'CONDITIONAL')) {
        overallStatus = 'CONDITIONAL';
      } else if (evaluations.some((e) => e.status === 'UNKNOWN')) {
        overallStatus = 'UNKNOWN';
      } else if (evaluations.length === 0) {
        overallStatus = 'UNKNOWN';
      }

      let justification = '';
      if (overallStatus === 'COMPATIBLE') {
        justification = `Fully compatible with all verified requirements (${matchingCaps.length} capabilities, ${throughputRps} RPS).`;
      } else if (overallStatus === 'CONDITIONAL') {
        justification = `Supported with operational conditions: ${conditions.join('; ')}.`;
      } else if (overallStatus === 'INCOMPATIBLE') {
        justification = `Incompatible due to: ${conflicts.join('; ')}.`;
      } else {
        justification = `Insufficient evidence in the knowledge base: ${unknowns.join('; ')}.`;
      }

      candidateEvaluations.push({
        candidateId: prodId,
        candidateName: prodName,
        provider: prod.provider,
        overallStatus,
        throughputRps,
        authMethods,
        supportedNetworks: supportedNetRefs,
        matchingCapabilities: matchingCaps,
        evaluations,
        conditions,
        conflicts,
        unknowns,
        justification,
      });
    }

    // Sort candidates: COMPATIBLE > CONDITIONAL > UNKNOWN > INCOMPATIBLE
    const statusOrder: Record<FourStateStatus, number> = {
      COMPATIBLE: 0,
      CONDITIONAL: 1,
      UNKNOWN: 2,
      INCOMPATIBLE: 3,
    };

    candidateEvaluations.sort((a, b) => statusOrder[a.overallStatus] - statusOrder[b.overallStatus]);

    return {
      candidates: candidateEvaluations,
      constraintMatrix: allMatrixRows,
    };
  }
}
