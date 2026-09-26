/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const constraint = defineType({
  name: 'constraint',
  title: 'Constraint',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Constraint Title',
      type: 'string',
      description: 'Concise summary of the limitation (e.g. "Base L2 WebSocket 60s Idle Timeout").',
      validation: (rule) => rule.required().error('Constraint name is required'),
    }),
    defineField({
      name: 'type',
      title: 'Constraint Type',
      type: 'string',
      options: {
        list: [
          { title: 'Network Limitation (re-org, block time, RPC)', value: 'network' },
          { title: 'Runtime Environment (Node, Edge, Browser)', value: 'runtime' },
          { title: 'Authentication & Scopes', value: 'authentication' },
          { title: 'Rate Limit & Burst Caps', value: 'rate_limit' },
          { title: 'API / Protocol Versioning', value: 'version' },
          { title: 'Deployment Target (Serverless vs Long-running)', value: 'deployment' },
          { title: 'Feature Availability', value: 'feature' },
          { title: 'Security & Secret Management', value: 'security' },
          { title: 'Other Constraint', value: 'other' },
        ],
      },
      initialValue: 'network',
      validation: (rule) => rule.required().error('Constraint type is required'),
    }),
    defineField({
      name: 'severity',
      title: 'Constraint Severity',
      type: 'string',
      options: {
        list: [
          { title: 'Info — Informational advisory', value: 'info' },
          { title: 'Warning — Degraded performance / caveat', value: 'warning' },
          { title: 'Blocking — Hard blocker preventing deployment', value: 'blocking' },
        ],
        layout: 'radio',
      },
      initialValue: 'warning',
      validation: (rule) => rule.required().error('Severity is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Clear statement of what occurs when this constraint is triggered.',
      validation: (rule) => rule.required().error('Description is required'),
    }),
    defineField({
      name: 'appliesTo',
      title: 'Applies To (Target Entities)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [
            { type: 'apiProduct' },
            { type: 'apiEndpoint' },
            { type: 'network' },
            { type: 'capability' },
            { type: 'technology' },
          ],
        }),
      ],
      description: 'Entities directly governed or impacted by this constraint.',
    }),
    defineField({
      name: 'condition',
      title: 'Trigger Condition',
      type: 'text',
      rows: 2,
      description: 'Exact scenario or threshold under which this constraint applies.',
    }),
    defineField({
      name: 'workaround',
      title: 'Remediation / Workaround',
      type: 'text',
      rows: 3,
      description: 'Recommended engineering solution to bypass or accommodate this constraint.',
    }),
    defineField({
      name: 'source',
      title: 'Constraint Source',
      type: 'string',
      description: 'Origin of this constraint (e.g. "Controlled demo dataset", "Protocol Spec").',
      initialValue: 'Controlled demo dataset',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      severity: 'severity',
      type: 'type',
    },
    prepare({ name, severity, type }) {
      return {
        title: name,
        subtitle: `[${(severity || 'warning').toUpperCase()}] Type: ${type || 'general'}`,
      };
    },
  },
});
