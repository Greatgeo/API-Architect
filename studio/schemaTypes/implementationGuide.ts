/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const implementationGuide = defineType({
  name: 'implementationGuide',
  title: 'Implementation Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Guide Title',
      type: 'string',
      description: 'e.g. "Implementing Real-Time Token Transfer Webhooks with Express".',
      validation: (rule) => rule.required().error('Guide title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Slug is required'),
    }),
    defineField({
      name: 'summary',
      title: 'Executive Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().error('Summary is required'),
    }),
    defineField({
      name: 'technology',
      title: 'Target Technology Stack',
      type: 'reference',
      to: [{ type: 'technology' }],
      validation: (rule) => rule.required().error('Target technology reference is required'),
      description: 'The primary language, framework, or runtime this guide targets.',
    }),
    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Tools, SDK versions, or keys required before starting.',
    }),
    defineField({
      name: 'steps',
      title: 'Step-by-Step Implementation Sequence',
      type: 'array',
      of: [defineArrayMember({ type: 'implementationStep' })],
      validation: (rule) =>
        rule.required().min(1).error('At least one implementation step is required'),
    }),
    defineField({
      name: 'commonProblems',
      title: 'Common Troubleshooting Scenarios',
      type: 'array',
      of: [defineArrayMember({ type: 'commonProblem' })],
    }),
    defineField({
      name: 'relatedEndpoints',
      title: 'Related Endpoints',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'apiEndpoint' }],
        }),
      ],
    }),
    defineField({
      name: 'relatedCapabilities',
      title: 'Related Capabilities',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'capability' }],
        }),
      ],
    }),
    defineField({
      name: 'source',
      title: 'Guide Origin / Source',
      type: 'string',
      initialValue: 'Controlled demo dataset',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      techName: 'technology.name',
    },
    prepare({ title, techName }) {
      return {
        title,
        subtitle: `Stack: ${techName || 'General'}`,
      };
    },
  },
});
