/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Sanity Context MCP Types
 * Type definitions for Model Context Protocol client, health checks, and tool payloads.
 */

export type MCPHealthStatus =
  | 'connected'
  | 'not_configured'
  | 'unreachable'
  | 'auth_failure'
  | 'error';

export type MCPMode = 'LIVE_MCP' | 'LOCAL_FALLBACK';

export interface MCPHealthResponse {
  configured: boolean;
  connected: boolean;
  mode: MCPMode;
  status: MCPHealthStatus;
  endpointUrl?: string;
  projectId?: string;
  dataset?: string;
  message: string;
  availableTools: string[];
  latencyMs?: number;
  timestamp: string;
}

export interface SanityContextConfig {
  projectId?: string;
  dataset?: string;
  organizationId?: string;
  endpointUrl?: string;
  token?: string;
  timeoutMs?: number;
}

export interface GROQQueryParams {
  query: string;
  params?: Record<string, any>;
}

export interface KnowledgeSearchParams {
  query: string;
  limit?: number;
  filter?: string;
}

export interface MCPToolCallResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  executionTimeMs: number;
}
