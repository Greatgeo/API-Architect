/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Staged Retrieval Engine
 * Executes targeted retrieval across Sanity Content Lake and Knowledge Base
 * following the 7-stage strategy: Networks -> Capabilities -> Products ->
 * Endpoints -> Compatibility Rules -> Constraints -> Knowledge Base Articles.
 */

import { SanityContextService } from '../mcp/sanityContext.ts';
import { ExtractedRequirements } from './types.ts';

export interface RetrievedContentSet {
  networks: any[];
  capabilities: any[];
  products: any[];
  endpoints: any[];
  compatibilityRules: any[];
  constraints: any[];
  knowledgeDocuments: any[];
  implementationGuides: any[];
  codeExamples: any[];
  retrievalProvenance: {
    dataSource: string;
    durationMs: number;
    counts: Record<string, number>;
  };
}

export class StagedRetriever {
  private service: SanityContextService;

  constructor() {
    this.service = SanityContextService.getInstance();
  }

  /**
   * Executes the 7-stage retrieval workflow based on extracted requirements.
   */
  public async retrieve(req: ExtractedRequirements): Promise<RetrievedContentSet> {
    const startTime = Date.now();

    // Stage 1 & 2: Networks & Capabilities
    const [allNetworks, allCapabilities, allProducts, allRules, allConstraints] =
      await Promise.all([
        this.service.getNetworks(),
        this.service.getCapabilities(),
        this.service.getProducts(),
        this.service.getCompatibilityRules(),
        this.service.getConstraints(),
      ]);

    // Filter relevant networks
    const relevantNetworkIds = new Set(req.networks.map((n) => n.id));
    const matchedNetworks = allNetworks.filter(
      (n: any) =>
        relevantNetworkIds.has(n._id) ||
        req.networks.some((rn) => n.slug?.current === rn.slug)
    );

    // Filter relevant capabilities
    const relevantCapIds = new Set(req.capabilities.map((c) => c.id));
    const matchedCapabilities = allCapabilities.filter(
      (c: any) =>
        relevantCapIds.has(c._id) ||
        req.capabilities.some((rc) => c.slug?.current === rc.slug)
    );

    // Stage 3: Candidate API Products
    let finalProducts: any[] = [];
    if (req.targetProduct) {
      finalProducts = allProducts.filter((p: any) => p._id === req.targetProduct?.id);
      if (finalProducts.length === 0) finalProducts = allProducts;
    } else {
      const candidateProducts = allProducts.filter((product: any) => {
        // Check if product supports any of the requested networks
        if (req.networks.length > 0) {
          const productNetRefs = (product.supportedNetworks || []).map((ref: any) => ref._ref);
          const hasNetworkMatch = req.networks.some((rn) => productNetRefs.includes(rn.id));
          if (hasNetworkMatch) return true;
        }
        // Check if product offers any of the requested capabilities
        if (req.capabilities.length > 0) {
          const productCapRefs = (product.capabilities || []).map((ref: any) => ref._ref);
          const hasCapMatch = req.capabilities.some((rc) => productCapRefs.includes(rc.id));
          if (hasCapMatch) return true;
        }
        return false;
      });

      finalProducts = candidateProducts.length > 0 ? candidateProducts : allProducts;
    }

    // Stage 4: Retrieve endpoints for candidate products
    const candidateProductIds = new Set(finalProducts.map((p: any) => p._id));
    const allEndpoints = await this.service.getEndpoints();
    const relevantEndpoints = allEndpoints.filter((ep: any) =>
      candidateProductIds.has(ep.product?._ref)
    );

    // Stage 5: Retrieve relevant compatibility rules
    const relevantRules = allRules.filter((rule: any) => {
      const itemARef = rule.itemA?._ref;
      const itemBRef = rule.itemB?._ref;
      const referencesCandidate =
        candidateProductIds.has(itemARef) || candidateProductIds.has(itemBRef);
      const referencesNetwork =
        relevantNetworkIds.has(itemARef) || relevantNetworkIds.has(itemBRef);
      const referencesCap =
        relevantCapIds.has(itemARef) || relevantCapIds.has(itemBRef);

      return referencesCandidate || referencesNetwork || referencesCap;
    });

    // Stage 6: Retrieve relevant constraints
    const relevantConstraints = allConstraints.filter((c: any) => {
      const targetRef = c.targetItem?._ref;
      return candidateProductIds.has(targetRef) || relevantNetworkIds.has(targetRef);
    });

    // Stage 7: Knowledge Base Retrieval & Guides
    const searchTerms = [
      ...req.networks.map((n) => n.name),
      ...req.capabilities.map((c) => c.name),
      ...req.conditions,
      req.minimumRateLimit ? 'rate limit' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const [kbDocs, guides, examples] = await Promise.all([
      this.service.searchKnowledge(searchTerms || 'blockchain api architecture', 4),
      this.service.getImplementationGuides(),
      this.service.getCodeExamples(),
    ]);

    const relevantGuides = guides.filter((g: any) =>
      g.relevantProducts?.some((ref: any) => candidateProductIds.has(ref._ref))
    );

    const relevantExamples = examples.filter((ex: any) =>
      ex.relevantProducts?.some((ref: any) => candidateProductIds.has(ref._ref))
    );

    const durationMs = Date.now() - startTime;

    return {
      networks: matchedNetworks.length > 0 ? matchedNetworks : allNetworks,
      capabilities: matchedCapabilities.length > 0 ? matchedCapabilities : allCapabilities,
      products: finalProducts,
      endpoints: relevantEndpoints,
      compatibilityRules: relevantRules,
      constraints: relevantConstraints,
      knowledgeDocuments: kbDocs,
      implementationGuides: relevantGuides,
      codeExamples: relevantExamples,
      retrievalProvenance: {
        dataSource: this.service.getDataSourceName(),
        durationMs,
        counts: {
          products: finalProducts.length,
          endpoints: relevantEndpoints.length,
          networks: matchedNetworks.length,
          capabilities: matchedCapabilities.length,
          compatibilityRules: relevantRules.length,
          constraints: relevantConstraints.length,
          knowledgeDocuments: kbDocs.length,
          guides: relevantGuides.length,
          codeExamples: relevantExamples.length,
        },
      },
    };
  }
}
