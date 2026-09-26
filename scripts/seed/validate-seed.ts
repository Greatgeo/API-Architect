/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Seed Dataset Integrity & Reference Validator
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface SanityDoc {
  _id: string;
  _type: string;
  [key: string]: any;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');
const EXPECTED_TYPES = new Set([
  'network',
  'technology',
  'capability',
  'apiProduct',
  'apiEndpoint',
  'compatibilityRule',
  'constraint',
  'implementationGuide',
  'codeExample',
  'knowledgeDocument',
]);

export function loadAllSeedDocuments(): SanityDoc[] {
  const files = [
    'networks.json',
    'technologies.json',
    'capabilities.json',
    'apiProducts.json',
    'apiEndpoints.json',
    'compatibilityRules.json',
    'constraints.json',
    'implementationGuides.json',
    'codeExamples.json',
    'knowledgeDocuments.json',
  ];

  const docs: SanityDoc[] = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing seed data file: ${file}`);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content) as SanityDoc[];
    docs.push(...parsed);
  }

  return docs;
}

export function validateSeedDataset(): {
  isValid: boolean;
  totalDocs: number;
  typeCounts: Record<string, number>;
  errors: string[];
} {
  const docs = loadAllSeedDocuments();
  const errors: string[] = [];
  const docMap = new Map<string, SanityDoc>();
  const typeCounts: Record<string, number> = {};

  // 1. Check uniqueness and valid types
  for (const doc of docs) {
    if (!doc._id) {
      errors.push(`Document is missing required '_id': ${JSON.stringify(doc)}`);
      continue;
    }

    if (docMap.has(doc._id)) {
      errors.push(`Duplicate document _id detected: '${doc._id}'`);
    } else {
      docMap.set(doc._id, doc);
    }

    if (!doc._type || !EXPECTED_TYPES.has(doc._type)) {
      errors.push(`Document '${doc._id}' has invalid or unexpected _type: '${doc._type}'`);
    }

    typeCounts[doc._type] = (typeCounts[doc._type] || 0) + 1;
  }

  // Helper to recursively collect references
  function collectReferences(obj: any, currentPath: string, docId: string): { ref: string; path: string }[] {
    const refs: { ref: string; path: string }[] = [];
    if (!obj || typeof obj !== 'object') return refs;

    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => {
        refs.push(...collectReferences(item, `${currentPath}[${idx}]`, docId));
      });
    } else {
      if (obj._type === 'reference' && typeof obj._ref === 'string') {
        refs.push({ ref: obj._ref, path: currentPath });
      }
      for (const key of Object.keys(obj)) {
        if (key !== '_type' && key !== '_ref') {
          refs.push(...collectReferences(obj[key], `${currentPath}.${key}`, docId));
        }
      }
    }

    return refs;
  }

  // 2. Validate reference integrity
  let totalReferencesChecked = 0;
  for (const doc of docs) {
    const refs = collectReferences(doc, doc._type, doc._id);
    for (const { ref, path } of refs) {
      totalReferencesChecked++;
      if (!docMap.has(ref)) {
        errors.push(
          `Dangling reference detected in '${doc._id}' at path '${path}': target document '${ref}' does not exist.`
        );
      }
    }
  }

  // 3. Validate mandatory field constraints per document type
  for (const doc of docs) {
    switch (doc._type) {
      case 'apiProduct':
        if (!doc.name) errors.push(`apiProduct '${doc._id}' missing name`);
        if (!doc.slug?.current) errors.push(`apiProduct '${doc._id}' missing slug`);
        if (!doc.provider) errors.push(`apiProduct '${doc._id}' missing provider`);
        if (!doc.status) errors.push(`apiProduct '${doc._id}' missing status`);
        break;

      case 'apiEndpoint':
        if (!doc.name) errors.push(`apiEndpoint '${doc._id}' missing name`);
        if (!doc.product?._ref) errors.push(`apiEndpoint '${doc._id}' missing product reference`);
        if (!doc.method) errors.push(`apiEndpoint '${doc._id}' missing HTTP method`);
        if (!doc.path) errors.push(`apiEndpoint '${doc._id}' missing path`);
        break;

      case 'network':
        if (!doc.name) errors.push(`network '${doc._id}' missing name`);
        if (!doc.slug?.current) errors.push(`network '${doc._id}' missing slug`);
        if (!doc.type) errors.push(`network '${doc._id}' missing type`);
        break;

      case 'capability':
        if (!doc.name) errors.push(`capability '${doc._id}' missing name`);
        if (!doc.slug?.current) errors.push(`capability '${doc._id}' missing slug`);
        if (!doc.description) errors.push(`capability '${doc._id}' missing description`);
        break;

      case 'compatibilityRule':
        if (!doc.name) errors.push(`compatibilityRule '${doc._id}' missing name`);
        if (!doc.itemA?._ref) errors.push(`compatibilityRule '${doc._id}' missing itemA reference`);
        if (!doc.itemB?._ref) errors.push(`compatibilityRule '${doc._id}' missing itemB reference`);
        if (!['compatible', 'conditional', 'incompatible', 'unknown'].includes(doc.status)) {
          errors.push(`compatibilityRule '${doc._id}' has invalid status: ${doc.status}`);
        }
        if (!doc.explanation) errors.push(`compatibilityRule '${doc._id}' missing explanation`);
        break;

      case 'constraint':
        if (!doc.name) errors.push(`constraint '${doc._id}' missing name`);
        if (!['info', 'warning', 'blocking'].includes(doc.severity)) {
          errors.push(`constraint '${doc._id}' has invalid severity: ${doc.severity}`);
        }
        if (!doc.description) errors.push(`constraint '${doc._id}' missing description`);
        break;

      case 'implementationGuide':
        if (!doc.title) errors.push(`implementationGuide '${doc._id}' missing title`);
        if (!doc.technology?._ref) errors.push(`implementationGuide '${doc._id}' missing technology`);
        if (!Array.isArray(doc.steps) || doc.steps.length === 0) {
          errors.push(`implementationGuide '${doc._id}' must have at least one step`);
        }
        break;

      case 'codeExample':
        if (!doc.title) errors.push(`codeExample '${doc._id}' missing title`);
        if (!doc.language) errors.push(`codeExample '${doc._id}' missing language`);
        if (!doc.code) errors.push(`codeExample '${doc._id}' missing code content`);
        break;

      case 'knowledgeDocument':
        if (!doc.title) errors.push(`knowledgeDocument '${doc._id}' missing title`);
        if (!doc.summary) errors.push(`knowledgeDocument '${doc._id}' missing summary`);
        if (!doc.content) errors.push(`knowledgeDocument '${doc._id}' missing content`);
        break;
    }
  }

  const isValid = errors.length === 0;

  console.log('=================================================================');
  console.log('API Architect — Seed Dataset Validation Results');
  console.log('=================================================================');
  console.log(`Total Documents Analyzed: ${docs.length}`);
  console.log(`Total Graph References Verified: ${totalReferencesChecked}`);
  console.log('Document Counts by Type:');
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`  - ${type}: ${count}`);
  }
  console.log('-----------------------------------------------------------------');

  if (isValid) {
    console.log('✔ VALIDATION PASSED: 0 errors detected. All references resolve perfectly.');
  } else {
    console.error(`✖ VALIDATION FAILED: ${errors.length} errors detected:`);
    errors.forEach((err, idx) => console.error(`  [${idx + 1}] ${err}`));
  }
  console.log('=================================================================');

  return {
    isValid,
    totalDocs: docs.length,
    typeCounts,
    errors,
  };
}

if (process.argv[1] && process.argv[1].endsWith('validate-seed.ts')) {
  const result = validateSeedDataset();
  if (!result.isValid) {
    process.exit(1);
  }
}
