/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Configuration Validation Utility
 *
 * Designed to provide progressive validation.
 * Local development and testing work without throwing fatal crashes
 * when external integrations (Sanity, MCP, AI provider) are not yet configured.
 */

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  appUrl: string;
  sanity: {
    projectId?: string;
    dataset?: string;
    apiVersion?: string;
    isConfigured: boolean;
  };
  sanityContextMcp: {
    mcpUrl?: string;
    hasOrgToken: boolean;
    isConfigured: boolean;
  };
  aiProvider: {
    hasApiKey: boolean;
    isConfigured: boolean;
  };
}

export interface ConfigDiagnostic {
  status: 'ready_phase1' | 'partial' | 'fully_integrated';
  phase: string;
  missingServices: string[];
  configuredServices: string[];
}

/**
 * Reads and safely validates configuration from environment variables.
 * Does NOT throw fatal runtime errors during early phases.
 */
export function getAppConfig(): AppConfig {
  const env = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  const port = parseInt(process.env.PORT || '3000', 10);
  const appUrl = process.env.APP_URL || `http://localhost:${port}`;

  const sanityProjectId = process.env.SANITY_PROJECT_ID;
  const sanityDataset = process.env.SANITY_DATASET;
  const sanityIsConfigured = Boolean(
    sanityProjectId &&
    sanityProjectId !== 'your_sanity_project_id' &&
    sanityDataset
  );

  const mcpUrl = process.env.SANITY_CONTEXT_MCP_URL;
  const orgToken = process.env.SANITY_ORGANIZATION_TOKEN;
  const mcpIsConfigured = Boolean(
    mcpUrl &&
    orgToken &&
    orgToken !== 'your_sanity_org_token_server_only'
  );

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const aiApiKey = process.env.AI_API_KEY || geminiApiKey;
  const aiIsConfigured = Boolean(aiApiKey && aiApiKey.trim().length > 0);

  return {
    env,
    port,
    appUrl,
    sanity: {
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: process.env.SANITY_API_VERSION || '2026-03-01',
      isConfigured: sanityIsConfigured,
    },
    sanityContextMcp: {
      mcpUrl,
      hasOrgToken: Boolean(orgToken && orgToken !== 'your_sanity_org_token_server_only'),
      isConfigured: mcpIsConfigured,
    },
    aiProvider: {
      hasApiKey: aiIsConfigured,
      isConfigured: aiIsConfigured,
    },
  };
}

/**
 * Returns non-sensitive configuration diagnostics for health checks and status views.
 * Strictly avoids leaking tokens, keys, or private URLs.
 */
export function getConfigDiagnostic(config: AppConfig = getAppConfig()): ConfigDiagnostic {
  const configuredServices: string[] = ['Local Core Foundation'];
  const missingServices: string[] = [];

  if (config.sanity.isConfigured) {
    configuredServices.push('Sanity Content Lake (Phase 2/3)');
  } else {
    missingServices.push('Sanity Content Lake (Phase 2/3)');
  }

  if (config.sanityContextMcp.isConfigured) {
    configuredServices.push('Sanity Context MCP (Phase 4)');
  } else {
    missingServices.push('Sanity Context MCP (Phase 4)');
  }

  if (config.aiProvider.isConfigured) {
    configuredServices.push('AI Reasoning Engine (Phase 5)');
  } else {
    missingServices.push('AI Reasoning Engine (Phase 5)');
  }

  return {
    status: configuredServices.length === 4 ? 'fully_integrated' : 'ready_phase1',
    phase: 'Phase 1: Architecture & Project Foundation',
    missingServices,
    configuredServices,
  };
}
