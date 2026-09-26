/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Agent Domain Types
 * Strict typed definitions for requirement extraction, evidence tracking,
 * deterministic four-state constraint evaluation, and verified implementation plans.
 */

export type FourStateStatus = 'COMPATIBLE' | 'CONDITIONAL' | 'INCOMPATIBLE' | 'UNKNOWN';

export interface ExtractedRequirementItem {
  id: string;
  name: string;
  slug: string;
  isExplicit: boolean;
  notes?: string;
}

export interface ExtractedRequirements {
  rawPrompt: string;
  targetProduct?: { id: string; name: string };
  networks: ExtractedRequirementItem[];
  capabilities: ExtractedRequirementItem[];
  authentication: {
    method: 'api_key' | 'bearer' | 'oauth' | 'webhook_secret';
    label: string;
    isExplicit: boolean;
  }[];
  minimumRateLimit: number | null;
  technologies: ExtractedRequirementItem[];
  conditions: string[];
  architectureRequirements: string[];
  missingInformation: string[];
  unknownRequirements: string[];
  isAmbiguous: boolean;
  ambiguityNotes: string[];
}

export type EvidenceSourceType =
  | 'apiProduct'
  | 'apiEndpoint'
  | 'network'
  | 'capability'
  | 'compatibilityRule'
  | 'constraint'
  | 'implementationGuide'
  | 'codeExample'
  | 'knowledgeDocument';

export interface EvidenceItem {
  id: string;
  sourceType: EvidenceSourceType;
  sourceId: string;
  sourceTitle: string;
  field?: string;
  claim: string;
  supportsRequirement?: string;
  contradictsRequirement?: string;
  condition?: string;
  relevance: 'high' | 'medium' | 'low';
  reference?: string;
}

export interface ConstraintEvaluation {
  id: string;
  requirementKey: string;
  requirementLabel: string;
  candidateId: string;
  candidateName: string;
  status: FourStateStatus;
  evidenceSnippet: string;
  condition?: string;
  conflictReason?: string;
  supportingEvidenceId: string;
}

export interface CandidateEvaluation {
  candidateId: string;
  candidateName: string;
  provider: string;
  overallStatus: FourStateStatus;
  throughputRps: number;
  authMethods: string[];
  supportedNetworks: string[];
  matchingCapabilities: string[];
  evaluations: ConstraintEvaluation[];
  conditions: string[];
  conflicts: string[];
  unknowns: string[];
  justification: string;
}

export interface ImplementationPlanStep {
  stepNumber: number;
  title: string;
  description: string;
  codeSnippetId?: string;
}

export interface RecommendedEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  purpose: string;
  rateLimit?: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface RiskOrLimitation {
  title: string;
  severity: 'info' | 'warning' | 'blocking';
  mitigation: string;
}

export interface ImplementationPlan {
  architectureOverview: string;
  selectedCandidates: {
    id: string;
    name: string;
    role: string;
    justification: string;
  }[];
  recommendedEndpoints: RecommendedEndpoint[];
  networkConfigurations: {
    name: string;
    chainId?: number;
    environment: string;
    caveats?: string;
  }[];
  authenticationGuidance: string;
  rateLimitStrategy: string;
  requiredConditions: string[];
  implementationSteps: ImplementationPlanStep[];
  codeSnippets: CodeSnippet[];
  risksAndLimitations: RiskOrLimitation[];
  unresolvedUnknowns: string[];
}

export interface AgentAnalysisOutput {
  analysisId: string;
  timestamp: string;
  requirement: ExtractedRequirements;
  dataSource: string;
  candidates: CandidateEvaluation[];
  constraintMatrix: ConstraintEvaluation[];
  evidenceList: EvidenceItem[];
  implementationPlan: ImplementationPlan;
  executiveSummary: string;
  overallStatus: FourStateStatus;
  metadata: {
    durationMs: number;
    evidenceCount: number;
    mcpMode: string;
  };
}
