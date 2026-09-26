/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Analysis & Reasoning Types
 * Data structures capturing developer requirements, constraint reasoning,
 * structured Sanity evidence references, and verified implementation plans.
 */

import { CompatibilityStatus, ConstraintSeverity } from './domain.ts';

/** Natural language requirement captured from developer */
export interface DeveloperRequirement {
  id: string;
  rawPrompt: string;
  extractedGoals: string[];
  extractedNetworks: string[];
  extractedCapabilities: string[];
  deliveryMethod?: 'webhook' | 'polling' | 'websocket' | 'grpc';
  timestamp: string;
}

/** Specific technical constraint parsed from requirement or discovered via rules */
export interface RequirementConstraint {
  id: string;
  description: string;
  severity: ConstraintSeverity;
  source: 'user_prompt' | 'network_limitation' | 'rate_limit' | 'compatibility_rule';
  isResolved: boolean;
  resolutionNote?: string;
}

/** Supporting evidence retrieved from Sanity Structured Content / Knowledge Base */
export interface Evidence {
  id: string;
  sourceType: 'sanity_document' | 'api_spec' | 'compatibility_rule' | 'implementation_guide';
  sanityDocumentId?: string;
  title: string;
  quoteOrExcerpt: string;
  referenceUrl?: string;
  relevanceExplanation: string;
}

/** Potential architectural candidate evaluated by the reasoning engine */
export interface CandidateSolution {
  id: string;
  apiProductId: string;
  apiProductName: string;
  compatibility: CompatibilityStatus;
  matchingCapabilities: string[];
  unsupportedCapabilities: string[];
  compatibilityReasoning: string;
  supportingEvidenceIds: string[];
}

/** Comprehensive verified implementation plan produced by the agent */
export interface AnalysisResult {
  id: string;
  requirement: DeveloperRequirement;
  timestamp: string;
  summary: string;
  overallStatus: CompatibilityStatus;
  primarySolution?: CandidateSolution;
  alternativeSolutions: CandidateSolution[];
  identifiedConstraints: RequirementConstraint[];
  evidenceList: Evidence[];
  actionableSteps: {
    stepNumber: number;
    title: string;
    description: string;
    codeSnippet?: string;
  }[];
  unsupportedElements: string[];
  conditionalWarnings: string[];
}
