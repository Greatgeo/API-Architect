/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Error Handling Foundation
 *
 * Establishes typed, domain-specific application errors and standard error response
 * formats across server and client boundaries for future reasoning phases.
 */

export type ArchitectErrorCode =
  | 'MCP_UNAVAILABLE'
  | 'KNOWLEDGE_BASE_UNAVAILABLE'
  | 'AI_SERVICE_UNAVAILABLE'
  | 'NO_MATCHING_CAPABILITY'
  | 'CONFLICTING_REQUIREMENTS'
  | 'UNSUPPORTED_NETWORK'
  | 'INSUFFICIENT_EVIDENCE'
  | 'INVALID_DEVELOPER_REQUEST'
  | 'INTERNAL_ERROR';

export interface ArchitectErrorDetails {
  code: ArchitectErrorCode;
  message: string;
  userFacingExplanation: string;
  suggestedAction?: string;
  statusCode: number;
  metadata?: Record<string, unknown>;
}

export class ArchitectError extends Error {
  public readonly code: ArchitectErrorCode;
  public readonly userFacingExplanation: string;
  public readonly suggestedAction?: string;
  public readonly statusCode: number;
  public readonly metadata?: Record<string, unknown>;

  constructor(details: ArchitectErrorDetails) {
    super(details.message);
    this.name = 'ArchitectError';
    this.code = details.code;
    this.userFacingExplanation = details.userFacingExplanation;
    this.suggestedAction = details.suggestedAction;
    this.statusCode = details.statusCode;
    this.metadata = details.metadata;
    Object.setPrototypeOf(this, ArchitectError.prototype);
  }

  public toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        explanation: this.userFacingExplanation,
        suggestedAction: this.suggestedAction,
        metadata: this.metadata,
      },
    };
  }
}

/** Pre-configured factory helpers for future error scenarios */
export const ErrorFactory = {
  mcpUnavailable: (details?: string) =>
    new ArchitectError({
      code: 'MCP_UNAVAILABLE',
      message: `Sanity Context MCP service unreachable: ${details || 'connection timeout'}`,
      userFacingExplanation:
        'The Sanity Context MCP retrieval service is temporarily unreachable. Structured content queries cannot be completed right now.',
      suggestedAction: 'Verify SANITY_CONTEXT_MCP_URL and server connectivity.',
      statusCode: 503,
    }),

  knowledgeBaseUnavailable: () =>
    new ArchitectError({
      code: 'KNOWLEDGE_BASE_UNAVAILABLE',
      message: 'Sanity Knowledge Base dataset is currently offline or unreachable.',
      userFacingExplanation:
        'Could not access API capability documentation from Sanity Content Lake.',
      suggestedAction: 'Check Sanity project credentials and dataset status.',
      statusCode: 503,
    }),

  aiServiceUnavailable: () =>
    new ArchitectError({
      code: 'AI_SERVICE_UNAVAILABLE',
      message: 'AI reasoning engine service reported an error or rate limit.',
      userFacingExplanation:
        'The AI verification agent is momentarily unavailable. Please retry in a few moments.',
      suggestedAction: 'Check AI provider quota and configuration.',
      statusCode: 502,
    }),

  noMatchingCapability: (requested: string[]) =>
    new ArchitectError({
      code: 'NO_MATCHING_CAPABILITY',
      message: `No verified capabilities match: ${requested.join(', ')}`,
      userFacingExplanation:
        'None of the cataloged API products currently support all the capabilities requested in your requirement.',
      suggestedAction: 'Consider adjusting the requirement or reviewing alternative architectures.',
      statusCode: 422,
      metadata: { requested },
    }),

  conflictingRequirements: (conflicts: string[]) =>
    new ArchitectError({
      code: 'CONFLICTING_REQUIREMENTS',
      message: `Requirement contains contradictory constraints: ${conflicts.join('; ')}`,
      userFacingExplanation:
        'The requested architecture contains mutually conflicting requirements (e.g., zero-latency websockets on a polling-only network).',
      suggestedAction: 'Review the conflicting items and prioritize primary architectural objectives.',
      statusCode: 422,
      metadata: { conflicts },
    }),

  unsupportedNetwork: (network: string) =>
    new ArchitectError({
      code: 'UNSUPPORTED_NETWORK',
      message: `Network ${network} is not supported by the evaluated API products.`,
      userFacingExplanation: `The target network "${network}" is not currently indexed or supported by this API catalog.`,
      suggestedAction: 'Check the list of supported networks or evaluate an L1 bridge.',
      statusCode: 422,
      metadata: { network },
    }),

  insufficientEvidence: (missingTopics: string[]) =>
    new ArchitectError({
      code: 'INSUFFICIENT_EVIDENCE',
      message: `Insufficient structured documentation to verify plan for: ${missingTopics.join(', ')}`,
      userFacingExplanation:
        'The system refuses to hallucinate an implementation plan without verified evidence from Sanity Content Lake.',
      suggestedAction: 'Seed additional documentation in Sanity Studio or refine search scope.',
      statusCode: 422,
      metadata: { missingTopics },
    }),

  invalidDeveloperRequest: (reason: string) =>
    new ArchitectError({
      code: 'INVALID_DEVELOPER_REQUEST',
      message: `Invalid developer input: ${reason}`,
      userFacingExplanation: 'Please provide a clear technical description of what you are building.',
      suggestedAction: 'Describe your target networks, data needs, or API delivery methods.',
      statusCode: 400,
    }),
};
