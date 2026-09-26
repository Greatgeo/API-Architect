/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Sanity Studio Schema Types Registry
 */

// Reusable Objects
import { limitation } from './objects/limitation.ts';
import { parameter } from './objects/parameter.ts';
import { responseField } from './objects/responseField.ts';
import { rateLimit } from './objects/rateLimit.ts';
import { requirement } from './objects/requirement.ts';
import { condition } from './objects/condition.ts';
import { conflict } from './objects/conflict.ts';
import { implementationStep } from './objects/implementationStep.ts';
import { commonProblem } from './objects/commonProblem.ts';

// Core Documents
import { apiProduct } from './apiProduct.ts';
import { apiEndpoint } from './apiEndpoint.ts';
import { network } from './network.ts';
import { capability } from './capability.ts';
import { compatibilityRule } from './compatibilityRule.ts';
import { constraint } from './constraint.ts';
import { implementationGuide } from './implementationGuide.ts';
import { codeExample } from './codeExample.ts';
import { technology } from './technology.ts';
import { knowledgeDocument } from './knowledgeDocument.ts';

export const schemaTypes = [
  // Object Types (Reusable schemas)
  limitation,
  parameter,
  responseField,
  rateLimit,
  requirement,
  condition,
  conflict,
  implementationStep,
  commonProblem,

  // Document Types (Core knowledge entities)
  apiProduct,
  apiEndpoint,
  network,
  capability,
  compatibilityRule,
  constraint,
  implementationGuide,
  codeExample,
  technology,
  knowledgeDocument,
];
