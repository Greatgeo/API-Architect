/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Sanity Studio Configuration
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes/index.ts';

// Progressive configuration: fallback project ID for schema validation and local studio building
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  'api-architect-sanity';

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  'production';

export default defineConfig({
  name: 'default',
  title: 'API Architect Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      title: 'Knowledge Base Content',
    }),
    visionTool({
      defaultApiVersion: '2026-03-01',
      defaultDataset: dataset,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
