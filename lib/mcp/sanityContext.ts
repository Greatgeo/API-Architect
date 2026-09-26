/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Unified Sanity Context Service
 * Connects the agent layer to either live Sanity Context MCP (when configured)
 * or the validated LocalSanityDatasetAdapter (in development fallback mode).
 * Emits clear provenance metrics for every retrieval operation.
 */

import { SanityContextClient } from './client.ts';
import { LocalSanityDatasetAdapter } from '../sanity/datasetAdapter.ts';
import { MCPHealthResponse } from './types.ts';

export class SanityContextService {
  private static instance: SanityContextService;
  private client: SanityContextClient;
  private localAdapter: LocalSanityDatasetAdapter;

  private constructor() {
    this.client = new SanityContextClient();
    this.localAdapter = LocalSanityDatasetAdapter.getInstance();
  }

  public static getInstance(): SanityContextService {
    if (!SanityContextService.instance) {
      SanityContextService.instance = new SanityContextService();
    }
    return SanityContextService.instance;
  }

  public getDataSourceName(): string {
    return this.client.isConfigured()
      ? 'LIVE_MCP (Sanity Context)'
      : 'LOCAL_FALLBACK (Controlled Sanity Dataset)';
  }

  public getMode(): 'LIVE_MCP' | 'LOCAL_FALLBACK' {
    return this.client.isConfigured() ? 'LIVE_MCP' : 'LOCAL_FALLBACK';
  }

  public isRemoteMCP(): boolean {
    return this.client.isConfigured();
  }

  public async getHealth(): Promise<MCPHealthResponse> {
    return this.client.checkHealth();
  }

  public async getNetworks(): Promise<any[]> {
    if (this.client.isConfigured()) {
      const res = await this.client.queryStructuredData({
        query: '*[_type == "network"] | order(name asc)',
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.getNetworks();
  }

  public async getCapabilities(): Promise<any[]> {
    if (this.client.isConfigured()) {
      const res = await this.client.queryStructuredData({
        query: '*[_type == "capability"] | order(name asc)',
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.getCapabilities();
  }

  public async getProducts(): Promise<any[]> {
    if (this.client.isConfigured()) {
      const res = await this.client.queryStructuredData({
        query: '*[_type == "apiProduct"] | order(name asc)',
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.getProducts();
  }

  public async getEndpoints(productId?: string): Promise<any[]> {
    if (this.client.isConfigured()) {
      const query = productId
        ? `*[_type == "apiEndpoint" && product._ref == $productId]`
        : `*[_type == "apiEndpoint"]`;
      const res = await this.client.queryStructuredData({
        query,
        params: productId ? { productId } : undefined,
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.getEndpoints(productId);
  }

  public async getCompatibilityRules(): Promise<any[]> {
    if (this.client.isConfigured()) {
      const res = await this.client.queryStructuredData({
        query: '*[_type == "compatibilityRule"]',
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.getCompatibilityRules();
  }

  public async getConstraints(): Promise<any[]> {
    if (this.client.isConfigured()) {
      const res = await this.client.queryStructuredData({
        query: '*[_type == "constraint"]',
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.getConstraints();
  }

  public async getImplementationGuides(productId?: string): Promise<any[]> {
    if (this.client.isConfigured()) {
      const query = productId
        ? `*[_type == "implementationGuide" && references($productId)]`
        : `*[_type == "implementationGuide"]`;
      const res = await this.client.queryStructuredData({
        query,
        params: productId ? { productId } : undefined,
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.getImplementationGuides(productId);
  }

  public async getCodeExamples(productId?: string, language?: string): Promise<any[]> {
    if (this.client.isConfigured()) {
      let query = '*[_type == "codeExample"]';
      if (productId && language) {
        query = `*[_type == "codeExample" && references($productId) && language == $language]`;
      } else if (productId) {
        query = `*[_type == "codeExample" && references($productId)]`;
      } else if (language) {
        query = `*[_type == "codeExample" && language == $language]`;
      }
      const res = await this.client.queryStructuredData({
        query,
        params: { productId, language },
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.getCodeExamples(productId, language);
  }

  public async searchKnowledge(query: string, limit = 5): Promise<any[]> {
    if (this.client.isConfigured()) {
      const res = await this.client.searchKnowledge({
        query,
        limit,
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.searchKnowledge(query, limit);
  }

  public async getKnowledgeDocuments(): Promise<any[]> {
    if (this.client.isConfigured()) {
      const res = await this.client.queryStructuredData({
        query: '*[_type == "knowledgeDocument"]',
      });
      if (res.success && Array.isArray(res.data)) return res.data;
    }
    return this.localAdapter.getKnowledgeDocuments();
  }
}
