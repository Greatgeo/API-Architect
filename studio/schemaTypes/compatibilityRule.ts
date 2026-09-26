/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const compatibilityRule = defineType({
  name: 'compatibilityRule',
  title: 'Compatibility Rule',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Rule Name / Identifier',
      type: 'string',
      description: 'Concise summary of the evaluated relationship (e.g. "Atlas Webhooks + Base Network Compatibility").',
      validation: (rule) => rule.required().error('Rule name is required'),
    }),
    defineField({
      name: 'itemA',
      title: 'First Entity (Item A)',
      type: 'reference',
      to: [
        { type: 'apiProduct' },
        { type: 'apiEndpoint' },
        { type: 'network' },
        { type: 'capability' },
        { type: 'technology' },
      ],
      validation: (rule) => rule.required().error('First entity reference (itemA) is required'),
      description: 'Primary entity in the compatibility evaluation.',
    }),
    defineField({
      name: 'itemB',
      title: 'Second Entity (Item B)',
      type: 'reference',
      to: [
        { type: 'apiProduct' },
        { type: 'apiEndpoint' },
        { type: 'network' },
        { type: 'capability' },
        { type: 'technology' },
      ],
      validation: (rule) => rule.required().error('Second entity reference (itemB) is required'),
      description: 'Secondary entity in the compatibility evaluation.',
    }),
    defineField({
      name: 'status',
      title: 'Compatibility Status',
      type: 'string',
      options: {
        list: [
          { title: 'Compatible — Verified seamless operation', value: 'compatible' },
          { title: 'Conditional — Requires specific settings or workarounds', value: 'conditional' },
          { title: 'Incompatible — Unsupported or technically impossible', value: 'incompatible' },
          { title: 'Unknown — Insufficient verified data', value: 'unknown' },
        ],
        layout: 'radio',
      },
      initialValue: 'compatible',
      validation: (rule) => rule.required().error('Compatibility status is required'),
    }),
    defineField({
      name: 'conditions',
      title: 'Mandatory Conditions / Caveats',
      type: 'array',
      of: [defineArrayMember({ type: 'condition' })],
      description: 'Required prerequisites for compatibility to hold (especially when status is conditional).',
    }),
    defineField({
      name: 'requirements',
      title: 'Infrastructure & Config Requirements',
      type: 'array',
      of: [defineArrayMember({ type: 'requirement' })],
    }),
    defineField({
      name: 'conflicts',
      title: 'Direct Architectural Conflicts',
      type: 'array',
      of: [defineArrayMember({ type: 'conflict' })],
      description: 'Known conflicting flags or incompatible protocol mechanisms.',
    }),
    defineField({
      name: 'explanation',
      title: 'Evidence-Based Explanation',
      type: 'text',
      rows: 4,
      description: 'Grounded rationale explaining WHY this relationship is compatible, conditional, or incompatible.',
      validation: (rule) => rule.required().error('Explanation is required to prevent hallucination'),
    }),
    defineField({
      name: 'source',
      title: 'Verification Source',
      type: 'string',
      description: 'Origin of this claim (e.g. "Controlled demo dataset", "Official Base Docs v2").',
      initialValue: 'Controlled demo dataset',
      validation: (rule) => rule.required().error('Verification source is required'),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      status: 'status',
      source: 'source',
    },
    prepare({ name, status, source }) {
      return {
        title: name,
        subtitle: `Status: ${(status || 'unknown').toUpperCase()} · Source: ${source || 'Unverified'}`,
      };
    },
  },
});
