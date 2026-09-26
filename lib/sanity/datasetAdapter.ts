/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Local Sanity Dataset Adapter (Development Fallback)
 * Provides deterministic, schema-aware query capabilities over the validated
 * 159-document controlled demonstration dataset when remote Sanity Context MCP
 * is not configured.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface DatasetStats {
  total: number;
  apiProducts: number;
  apiEndpoints: number;
  networks: number;
  capabilities: number;
  compatibilityRules: number;
  constraints: number;
  implementationGuides: number;
  codeExamples: number;
  technologies: number;
  knowledgeDocuments: number;
}

export class LocalSanityDatasetAdapter {
  private static instance: LocalSanityDatasetAdapter;
  private documents: Map<string, any> = new Map();
  private documentsByType: Map<string, any[]> = new Map();
  private isLoaded = false;

  private constructor() {
    this.loadDataset();
  }

  public static getInstance(): LocalSanityDatasetAdapter {
    if (!LocalSanityDatasetAdapter.instance) {
      LocalSanityDatasetAdapter.instance = new LocalSanityDatasetAdapter();
    }
    return LocalSanityDatasetAdapter.instance;
  }

  private loadDataset() {
    if (this.isLoaded) return;

    try {
      const dataDir = path.resolve(process.cwd(), 'scripts/seed/data');
      const files: Record<string, string> = {
        apiProduct: 'apiProducts.json',
        apiEndpoint: 'apiEndpoints.json',
        network: 'networks.json',
        capability: 'capabilities.json',
        compatibilityRule: 'compatibilityRules.json',
        constraint: 'constraints.json',
        implementationGuide: 'implementationGuides.json',
        codeExample: 'codeExamples.json',
        technology: 'technologies.json',
        knowledgeDocument: 'knowledgeDocuments.json',
      };

      for (const [type, file] of Object.entries(files)) {
        const filePath = path.join(dataDir, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          const docs: any[] = JSON.parse(content);
          this.documentsByType.set(type, docs);
          for (const doc of docs) {
            this.documents.set(doc._id, doc);
          }
        }
      }

      this.isLoaded = true;
    } catch (err) {
      console.warn('LocalSanityDatasetAdapter failed to load files from disk, will rely on lazy loading.', err);
    }
  }

  public getStats(): DatasetStats {
    return {
      total: this.documents.size,
      apiProducts: this.documentsByType.get('apiProduct')?.length || 0,
      apiEndpoints: this.documentsByType.get('apiEndpoint')?.length || 0,
      networks: this.documentsByType.get('network')?.length || 0,
      capabilities: this.documentsByType.get('capability')?.length || 0,
      compatibilityRules: this.documentsByType.get('compatibilityRule')?.length || 0,
      constraints: this.documentsByType.get('constraint')?.length || 0,
      implementationGuides: this.documentsByType.get('implementationGuide')?.length || 0,
      codeExamples: this.documentsByType.get('codeExample')?.length || 0,
      technologies: this.documentsByType.get('technology')?.length || 0,
      knowledgeDocuments: this.documentsByType.get('knowledgeDocument')?.length || 0,
    };
  }

  public getDocumentById<T = any>(id: string): T | undefined {
    return this.documents.get(id);
  }

  public getDocumentsByType<T = any>(type: string): T[] {
    return (this.documentsByType.get(type) as T[]) || [];
  }

  public getNetworks(): any[] {
    return this.getDocumentsByType('network');
  }

  public getCapabilities(): any[] {
    return this.getDocumentsByType('capability');
  }

  public getProducts(): any[] {
    return this.getDocumentsByType('apiProduct');
  }

  public getEndpoints(productId?: string): any[] {
    const endpoints = this.getDocumentsByType('apiEndpoint');
    if (!productId) return endpoints;
    return endpoints.filter((ep: any) => ep.product?._ref === productId);
  }

  public getCompatibilityRules(): any[] {
    return this.getDocumentsByType('compatibilityRule');
  }

  public getConstraints(): any[] {
    return this.getDocumentsByType('constraint');
  }

  public getImplementationGuides(productId?: string): any[] {
    const guides = this.getDocumentsByType('implementationGuide');
    if (!productId) return guides;
    return guides.filter((g: any) =>
      g.relevantProducts?.some((ref: any) => ref._ref === productId)
    );
  }

  public getCodeExamples(productId?: string, language?: string): any[] {
    let examples = this.getDocumentsByType('codeExample');
    if (productId) {
      examples = examples.filter((ex: any) =>
        ex.relevantProducts?.some((ref: any) => ref._ref === productId)
      );
    }
    if (language) {
      examples = examples.filter((ex: any) => ex.language === language);
    }
    return examples;
  }

  public getKnowledgeDocuments(): any[] {
    return this.getDocumentsByType('knowledgeDocument');
  }

  /**
   * Search knowledge documents based on natural language terms.
   */
  public searchKnowledge(query: string, limit = 5): any[] {
    const docs = this.getKnowledgeDocuments();
    const queryTokens = query
      .toLowerCase()
      .split(/[^a-z0-9_-]+/)
      .filter((t) => t.length > 2);

    const scored = docs.map((doc: any) => {
      let score = 0;
      const titleLower = (doc.title || '').toLowerCase();
      const summaryLower = (doc.summary || '').toLowerCase();
      const contentLower = (doc.content || '').toLowerCase();
      const topics: string[] = (doc.topics || []).map((t: string) => t.toLowerCase());

      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 10;
        if (topics.some((t) => t.includes(token))) score += 8;
        if (summaryLower.includes(token)) score += 4;
        if (contentLower.includes(token)) score += 1;
      }

      return { doc, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.doc);
  }
}
