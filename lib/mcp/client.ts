/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Sanity Context MCP Client
 * Server-side client abstraction for interacting with hosted Sanity Context MCP.
 * Implements health checks, initial context retrieval, structured GROQ queries,
 * and semantic Knowledge Base search via MCP standard tool interfaces.
 */

import {
  MCPHealthResponse,
  SanityContextConfig,
  GROQQueryParams,
  KnowledgeSearchParams,
  MCPToolCallResult,
} from './types.ts';

export class SanityContextClient {
  private projectId?: string;
  private dataset?: string;
  private endpointUrl: string;
  private token?: string;
  private timeoutMs: number;

  constructor(config?: SanityContextConfig) {
    this.projectId =
      config?.projectId ||
      process.env.SANITY_PROJECT_ID ||
      process.env.SANITY_STUDIO_PROJECT_ID;

    this.dataset =
      config?.dataset ||
      process.env.SANITY_DATASET ||
      process.env.SANITY_STUDIO_DATASET ||
      'production';

    // Prioritize organization-level token with Context Viewer permission
    this.token =
      config?.token ||
      process.env.SANITY_ORGANIZATION_TOKEN ||
      process.env.SANITY_CONTEXT_MCP_TOKEN ||
      process.env.SANITY_API_READ_TOKEN;

    // Use complete endpoint URL from SANITY_CONTEXT_MCP_URL
    // e.g. https://api.sanity.io/v1/context/organizations/<ORGANIZATION_ID>/mcp/<MCP_ENDPOINT_NAME>
    const customUrl = (config?.endpointUrl || process.env.SANITY_CONTEXT_MCP_URL || '').trim();
    if (customUrl && !this.isPlaceholder(customUrl)) {
      this.endpointUrl = customUrl;
    } else {
      this.endpointUrl = 'https://api.sanity.io/v1/context/unconfigured';
    }

    this.timeoutMs = config?.timeoutMs || 8000;
  }

  private isPlaceholder(val?: string): boolean {
    if (!val) return true;
    const lower = val.toLowerCase().trim();
    return (
      lower === '' ||
      lower.includes('your_') ||
      lower.includes('placeholder') ||
      lower.includes('<organization_id>') ||
      lower.includes('<mcp_endpoint_name>') ||
      lower.includes('example') ||
      lower === 'api-architect-sanity' ||
      lower === 'my-project'
    );
  }

  /**
   * Evaluates whether real, verified Sanity MCP credentials are configured.
   */
  public isConfigured(): boolean {
    const hasEndpoint =
      Boolean(this.endpointUrl) &&
      !this.isPlaceholder(this.endpointUrl) &&
      !this.endpointUrl.includes('unconfigured');
    const hasToken = Boolean(this.token) && !this.isPlaceholder(this.token);
    return hasEndpoint && hasToken;
  }

  /**
   * Server-side health check against Sanity Context MCP endpoint.
   * Never returns LIVE_MCP merely because env vars exist; verifies actual connection.
   */
  public async checkHealth(): Promise<MCPHealthResponse> {
    const startTime = Date.now();

    if (!this.isConfigured()) {
      return {
        configured: false,
        connected: false,
        mode: 'LOCAL_FALLBACK',
        status: 'not_configured',
        endpointUrl: this.endpointUrl,
        projectId: this.projectId,
        dataset: this.dataset,
        message:
          'Sanity Context MCP credentials are not configured. Operating in validated local dataset fallback mode.',
        availableTools: ['groq_query (local adapter)', 'search_knowledge (local adapter)'],
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      // Probe MCP endpoint using tools/list or initial connection probe
      const toolsResult = await this.listTools();

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (!toolsResult.success) {
        const errorMsg = toolsResult.error || 'Connection failed';
        const isAuthError =
          errorMsg.includes('401') ||
          errorMsg.includes('403') ||
          errorMsg.toLowerCase().includes('unauthorized') ||
          errorMsg.toLowerCase().includes('forbidden');

        const isUnreachable =
          !isAuthError &&
          (errorMsg.toLowerCase().includes('connection') ||
            errorMsg.toLowerCase().includes('failed to query') ||
            errorMsg.toLowerCase().includes('abort') ||
            errorMsg.toLowerCase().includes('timeout') ||
            errorMsg.toLowerCase().includes('econnrefused') ||
            errorMsg.toLowerCase().includes('fetch failed'));

        const status = isAuthError ? 'auth_failure' : isUnreachable ? 'unreachable' : 'error';

        return {
          configured: true,
          connected: false,
          mode: 'LOCAL_FALLBACK',
          status,
          endpointUrl: this.endpointUrl,
          projectId: this.projectId,
          dataset: this.dataset,
          message: `Sanity Context MCP connection check failed: ${errorMsg}`,
          availableTools: [],
          latencyMs,
          timestamp: new Date().toISOString(),
        };
      }

      const toolNames = (toolsResult.data || []).map((t) => t.name);

      return {
        configured: true,
        connected: true,
        mode: 'LIVE_MCP',
        status: 'connected',
        endpointUrl: this.endpointUrl,
        projectId: this.projectId,
        dataset: this.dataset,
        message: 'Sanity Context MCP is connected and reachable.',
        availableTools: toolNames.length > 0 ? toolNames : ['initial_context', 'groq_query', 'schema_explorer'],
        latencyMs,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        configured: true,
        connected: false,
        mode: 'LOCAL_FALLBACK',
        status: 'unreachable',
        endpointUrl: this.endpointUrl,
        projectId: this.projectId,
        dataset: this.dataset,
        message: `Sanity Context MCP endpoint unreachable: ${err.message || 'Connection failed'}`,
        availableTools: [],
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Discovers and lists available tools from the live Sanity Context MCP endpoint.
   * Dispatches standard MCP 'tools/list' JSON-RPC call.
   */
  public async listTools(): Promise<MCPToolCallResult<{ name: string; description?: string }[]>> {
    const startTime = Date.now();

    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Sanity Context MCP credentials not configured',
        executionTimeMs: Date.now() - startTime,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      // Try MCP JSON-RPC tools/list
      const response = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
          'User-Agent': 'API-Architect-Agent/1.0.0',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
          params: {},
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Fallback check on GET /initial-context or /tools
        const altResponse = await fetch(`${this.endpointUrl}/initial-context`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
          },
        });

        if (altResponse.ok) {
          return {
            success: true,
            data: [
              { name: 'initial_context', description: 'Sanity Context initial context' },
              { name: 'groq_query', description: 'Query Sanity Content Lake via GROQ' },
              { name: 'schema_explorer', description: 'Explore Sanity schema definitions' },
            ],
            executionTimeMs: Date.now() - startTime,
          };
        }

        return {
          success: false,
          error: `HTTP ${response.status} from Context MCP: ${response.statusText}`,
          executionTimeMs: Date.now() - startTime,
        };
      }

      const body = await response.json();
      const tools = body?.result?.tools || body?.tools || [];

      return {
        success: true,
        data: tools,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (err: any) {
      return {
        success: false,
        error: `Failed to query MCP tools: ${err.message || 'Connection failed'}`,
        executionTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute structured GROQ query over Sanity Content Lake via Context MCP.
   */
  public async queryStructuredData<T = any>(
    params: GROQQueryParams
  ): Promise<MCPToolCallResult<T>> {
    const startTime = Date.now();

    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Sanity Context MCP not configured',
        executionTimeMs: Date.now() - startTime,
      };
    }

    try {
      const response = await fetch(`${this.endpointUrl}/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: params.query,
          params: params.params,
        }),
      });

      if (!response.ok) {
        throw new Error(`MCP Query failed with HTTP ${response.status}`);
      }

      const json = await response.json();
      return {
        success: true,
        data: json.result ?? json,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        executionTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute semantic search over Sanity Knowledge Base via Context MCP.
   */
  public async searchKnowledge<T = any>(
    params: KnowledgeSearchParams
  ): Promise<MCPToolCallResult<T>> {
    const startTime = Date.now();

    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Sanity Context MCP not configured',
        executionTimeMs: Date.now() - startTime,
      };
    }

    try {
      const response = await fetch(`${this.endpointUrl}/search`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: params.query,
          limit: params.limit || 5,
          filter: params.filter,
        }),
      });

      if (!response.ok) {
        throw new Error(`MCP Knowledge Search failed with HTTP ${response.status}`);
      }

      const json = await response.json();
      return {
        success: true,
        data: json.result ?? json,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        executionTimeMs: Date.now() - startTime,
      };
    }
  }
}
