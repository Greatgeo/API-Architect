/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Evidence Collection Engine
 * Normalizes retrieved Sanity documents into traceable, structured EvidenceItem models.
 * Associates claims with explicit schema fields, relationships, and source document IDs.
 */

import { EvidenceItem } from './types.ts';
import { RetrievedContentSet } from './retrieve.ts';

export class EvidenceCollector {
  /**
   * Builds an explicit, compact evidence list from the retrieved Sanity content set.
   */
  public static collect(content: RetrievedContentSet): EvidenceItem[] {
    const evidence: EvidenceItem[] = [];

    // 1. API Products
    for (const prod of content.products) {
      const netCount = prod.supportedNetworks?.length || 0;
      const capCount = prod.capabilities?.length || 0;
      const rateLimitTitle = prod.limitations?.find((l: any) =>
        /throughput|rate/i.test(l.title || '')
      )?.title;

      evidence.push({
        id: `ev-prod-${prod._id}`,
        sourceType: 'apiProduct',
        sourceId: prod._id,
        sourceTitle: prod.name,
        field: 'supportedNetworks & capabilities',
        claim: `${prod.name} (Provider: ${prod.provider}) documents support for ${netCount} networks and ${capCount} capabilities with auth: ${(prod.authenticationMethods || []).join(', ')}${rateLimitTitle ? ` [${rateLimitTitle}]` : ''}.`,
        relevance: 'high',
        reference: prod.documentationUrl,
      });
    }

    // 2. Endpoints
    for (const ep of content.endpoints) {
      evidence.push({
        id: `ev-ep-${ep._id}`,
        sourceType: 'apiEndpoint',
        sourceId: ep._id,
        sourceTitle: `${ep.method} ${ep.path}`,
        field: 'path & capabilities',
        claim: `Endpoint '${ep.name}' (${ep.method} ${ep.path}) provides documented response schema and parameter validation. Rate limit: ${ep.rateLimit?.requestsPerMinute ? `${ep.rateLimit.requestsPerMinute} RPM` : 'Standard quota'}.`,
        relevance: 'high',
        reference: `product: ${ep.product?._ref}`,
      });
    }

    // 3. Compatibility Rules
    for (const rule of content.compatibilityRules) {
      const condString = (rule.conditions || [])
        .map((c: any) =>
          typeof c === 'string'
            ? c
            : c.description
            ? `${c.title}: ${c.description}`
            : c.title || ''
        )
        .filter(Boolean)
        .join('; ');

      evidence.push({
        id: `ev-rule-${rule._id}`,
        sourceType: 'compatibilityRule',
        sourceId: rule._id,
        sourceTitle: rule.name,
        field: 'status & explanation',
        claim: `[${rule.status.toUpperCase()}] ${rule.explanation}${condString ? ` Conditions: ${condString}` : ''}`,
        condition: condString || undefined,
        relevance: 'high',
        reference: `${rule.itemA?._ref} <-> ${rule.itemB?._ref}`,
      });
    }

    // 4. Constraints
    for (const con of content.constraints) {
      evidence.push({
        id: `ev-con-${con._id}`,
        sourceType: 'constraint',
        sourceId: con._id,
        sourceTitle: con.name,
        field: 'severity & mitigation',
        claim: `[${con.severity.toUpperCase()}] ${con.description}${con.mitigation ? ` Mitigation: ${con.mitigation}` : ''}`,
        relevance: 'medium',
        reference: con.targetItem?._ref,
      });
    }

    // 5. Knowledge Documents
    for (const kb of content.knowledgeDocuments) {
      evidence.push({
        id: `ev-kb-${kb._id}`,
        sourceType: 'knowledgeDocument',
        sourceId: kb._id,
        sourceTitle: kb.title,
        field: 'summary & content',
        claim: kb.summary,
        relevance: 'medium',
        reference: `Category: ${kb.category}`,
      });
    }

    return evidence;
  }
}
