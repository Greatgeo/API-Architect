/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Master Agent Orchestrator
 * Coordinates the full end-to-end reasoning pipeline:
 * Prompt -> Normalized Extraction -> Staged Sanity Retrieval ->
 * Deterministic Constraint Evaluation -> Evidence Collection ->
 * Implementation Plan Generation -> Structured Response Validation.
 */

import { RequirementExtractor } from './requirements.ts';
import { StagedRetriever } from './retrieve.ts';
import { EvidenceCollector } from './evidence.ts';
import { ConstraintEvaluator } from './constraints.ts';
import { ImplementationPlanner } from './planner.ts';
import { AgentAnalysisOutput, FourStateStatus } from './types.ts';

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private retriever: StagedRetriever;

  private constructor() {
    this.retriever = new StagedRetriever();
  }

  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  /**
   * Main entry point: analyzes a natural language developer requirement.
   */
  public async analyzeRequirement(prompt: string): Promise<AgentAnalysisOutput> {
    const startTime = Date.now();
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      throw new Error('Requirement prompt cannot be empty.');
    }

    // Step 1: Normalize & Extract Requirements
    const req = RequirementExtractor.extract(cleanPrompt);

    // Step 2: Staged Retrieval over Sanity Content Lake & Knowledge Base
    const content = await this.retriever.retrieve(req);

    // Step 3: Collect Traceable Evidence
    const evidenceList = EvidenceCollector.collect(content);

    // Step 4: Deterministic Constraint Evaluation
    const { candidates, constraintMatrix } = ConstraintEvaluator.evaluate(req, content);

    // Step 5: Synthesize Implementation Plan
    const implementationPlan = ImplementationPlanner.plan(req, candidates, content);

    // Step 6: Determine Overall Status
    let overallStatus: FourStateStatus = 'COMPATIBLE';
    const compatibleCandidates = candidates.filter((c) => c.overallStatus === 'COMPATIBLE');
    const conditionalCandidates = candidates.filter((c) => c.overallStatus === 'CONDITIONAL');
    const unknownCandidates = candidates.filter((c) => c.overallStatus === 'UNKNOWN');

    if (req.targetProduct) {
      const targetCand = candidates.find((c) => c.candidateId === req.targetProduct?.id);
      overallStatus = targetCand ? targetCand.overallStatus : 'UNKNOWN';
    } else {
      if (compatibleCandidates.length > 0) {
        overallStatus = 'COMPATIBLE';
      } else if (conditionalCandidates.length > 0) {
        overallStatus = 'CONDITIONAL';
      } else if (unknownCandidates.length > 0 && candidates.every((c) => c.overallStatus !== 'INCOMPATIBLE')) {
        overallStatus = 'UNKNOWN';
      } else {
        overallStatus = 'INCOMPATIBLE';
      }
    }

    // Step 7: Executive Summary
    let executiveSummary = '';
    if (overallStatus === 'COMPATIBLE') {
      const topCand = compatibleCandidates[0];
      executiveSummary = `Found verified compatibility with ${topCand.candidateName}. Supports all requested networks (${req.networks.map((n) => n.name).join(', ')}) and capabilities (${req.capabilities.map((c) => c.name).join(', ')}) at ${topCand.throughputRps} RPS throughput.`;
    } else if (overallStatus === 'CONDITIONAL') {
      const topCand = conditionalCandidates[0];
      executiveSummary = `Requirements can be satisfied by ${topCand.candidateName}, subject to operational conditions: ${topCand.conditions.join('; ')}.`;
    } else if (overallStatus === 'UNKNOWN') {
      executiveSummary =
        'The controlled Sanity dataset does not contain sufficient verified evidence to determine complete compatibility for one or more requested requirements. Adhering to the principle: No evidence -> no confident claim.';
    } else {
      executiveSummary =
        'No candidate in the current knowledge base satisfies all stated requirements. Found conflicting network support, missing capabilities, or throughput limits that fail requested constraints.';
    }

    const durationMs = Date.now() - startTime;

    const output: AgentAnalysisOutput = {
      analysisId: `analysis-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      requirement: req,
      dataSource: content.retrievalProvenance.dataSource,
      candidates,
      constraintMatrix,
      evidenceList,
      implementationPlan,
      executiveSummary,
      overallStatus,
      metadata: {
        durationMs,
        evidenceCount: evidenceList.length,
        mcpMode: content.retrievalProvenance.dataSource.includes('LIVE_MCP') ? 'LIVE_MCP' : 'LOCAL_FALLBACK',
      },
    };

    return output;
  }
}
