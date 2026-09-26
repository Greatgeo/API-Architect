/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Export Seed Data to NDJSON for Sanity Dataset Import
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAllSeedDocuments } from './validate-seed.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');

export function exportNdjson(): void {
  const docs = loadAllSeedDocuments();

  // Export combined NDJSON
  const combinedPath = path.join(DATA_DIR, 'api-architect-dataset.ndjson');
  const combinedContent = docs.map((doc) => JSON.stringify(doc)).join('\n') + '\n';
  fs.writeFileSync(combinedPath, combinedContent, 'utf-8');
  console.log(`Exported combined dataset: ${combinedPath} (${docs.length} documents)`);

  // Export type-specific NDJSON files for modular imports
  const docsByType: Record<string, any[]> = {};
  for (const doc of docs) {
    if (!docsByType[doc._type]) {
      docsByType[doc._type] = [];
    }
    docsByType[doc._type].push(doc);
  }

  for (const [type, typeDocs] of Object.entries(docsByType)) {
    const typePath = path.join(DATA_DIR, `${type}.ndjson`);
    const typeContent = typeDocs.map((doc) => JSON.stringify(doc)).join('\n') + '\n';
    fs.writeFileSync(typePath, typeContent, 'utf-8');
    console.log(`  Exported ${type}.ndjson (${typeDocs.length} documents)`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('export-ndjson.ts')) {
  exportNdjson();
}
