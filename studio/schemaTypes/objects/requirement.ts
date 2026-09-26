/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField } from 'sanity';

export const requirement = defineType({
  name: 'requirement',
  title: 'Requirement',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Requirement Name',
      type: 'string',
      validation: (rule) => rule.required().error('Requirement name is required'),
    }),
    defineField({
      name: 'type',
      title: 'Requirement Type',
      type: 'string',
      options: {
        list: [
          { title: 'Authentication', value: 'authentication' },
          { title: 'Rate Tier / Subscription', value: 'rate_tier' },
          { title: 'Network Access', value: 'network_access' },
          { title: 'Infrastructure', value: 'infrastructure' },
          { title: 'Webhook Receiver', value: 'webhook_receiver' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'authentication',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      type: 'type',
    },
    prepare({ name, type }) {
      return {
        title: name,
        subtitle: `Type: ${type}`,
      };
    },
  },
});
