/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Root Sanity CLI Configuration
 */

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId:
      process.env.SANITY_STUDIO_PROJECT_ID ||
      process.env.SANITY_PROJECT_ID ||
      'api-architect-sanity',
    dataset:
      process.env.SANITY_STUDIO_DATASET ||
      process.env.SANITY_DATASET ||
      'production',
  },
  studioHost: 'api-architect',
});
