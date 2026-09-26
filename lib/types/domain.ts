/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Core Domain Types
 * Foundation models for API catalog, networks, capabilities, and compatibility rules.
 * Designed to map cleanly to future Sanity schemas in Phase 2.
 */

/** Supported compatibility evaluation statuses */
export type CompatibilityStatus =
  | 'compatible'
  | 'conditional'
  | 'incompatible'
  | 'unknown';

/** Severity level for technical and architectural constraints */
export type ConstraintSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

/** Primary technology framework or runtime */
export interface Technology {
  id: string;
  name: string;
  slug: string;
  category: 'language' | 'framework' | 'sdk' | 'tooling';
  version?: string;
  documentationUrl?: string;
}

/** Supported blockchain networks, cloud platforms, or target environments */
export interface Network {
  id: string;
  name: string;
  slug: string;
  chainId?: number;
  environmentType: 'mainnet' | 'testnet' | 'l2' | 'sidechain' | 'cloud' | 'hybrid';
  status: 'active' | 'deprecated' | 'preview';
  supportedRpcProtocols: ('http' | 'ws' | 'grpc')[];
  blockTimeMs?: number;
  description?: string;
}

/** Specific technical capability provided by an API or network */
export interface Capability {
  id: string;
  name: string;
  slug: string;
  category:
    | 'token_monitoring'
    | 'event_indexing'
    | 'webhook_delivery'
    | 'gas_estimation'
    | 'transaction_simulation'
    | 'data_streaming'
    | 'historical_archive';
  description: string;
  supportedNetworkIds: string[];
  requiresAuthentication: boolean;
  rateLimitTps?: number;
}

/** Architectural, network, or rate constraint affecting implementation */
export interface Constraint {
  id: string;
  title: string;
  severity: ConstraintSeverity;
  description: string;
  affectedCapabilityIds: string[];
  affectedNetworkIds?: string[];
  workaround?: string;
}

/** Rule governing compatibility between networks, capabilities, and delivery patterns */
export interface CompatibilityRule {
  id: string;
  ruleCode: string;
  title: string;
  status: CompatibilityStatus;
  conditions: string[];
  explanation: string;
  requiredCapabilities: string[];
  restrictedNetworks?: string[];
}

/** Executable or reference code example */
export interface CodeExample {
  id: string;
  title: string;
  technologyId: string;
  language: 'typescript' | 'javascript' | 'python' | 'go' | 'rust' | 'curl';
  code: string;
  filename?: string;
  isRunnable: boolean;
}

/** Step-by-step implementation guide */
export interface ImplementationGuide {
  id: string;
  title: string;
  slug: string;
  summary: string;
  targetTechnologyIds: string[];
  steps: {
    order: number;
    title: string;
    instructions: string;
    codeExampleId?: string;
  }[];
  prerequisites: string[];
}

/** Specific endpoint belonging to an API Product */
export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'WS' | 'RPC';
  path: string;
  summary: string;
  capabilityIds: string[];
  supportedNetworkIds: string[];
  requestSchemaRef?: string;
  responseSchemaRef?: string;
  isDeprecated: boolean;
}

/** Top-level API Product offering */
export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  status: 'generally_available' | 'beta' | 'deprecated';
  endpointIds: string[];
  supportedNetworkIds: string[];
  capabilityIds: string[];
  documentationUrl?: string;
}
