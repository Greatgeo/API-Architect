/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField } from 'sanity';

export const commonProblem = defineType({
  name: 'commonProblem',
  title: 'Common Problem',
  type: 'object',
  fields: [
    defineField({
      name: 'problem',
      title: 'Problem Summary',
      type: 'string',
      validation: (rule) => rule.required().error('Problem summary is required'),
    }),
    defineField({
      name: 'cause',
      title: 'Root Cause',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().error('Root cause is required'),
    }),
    defineField({
      name: 'solution',
      title: 'Remediation / Solution',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().error('Solution instructions are required'),
    }),
  ],
  preview: {
    select: {
      problem: 'problem',
    },
    prepare({ problem }) {
      return {
        title: problem,
      };
    },
  },
});
