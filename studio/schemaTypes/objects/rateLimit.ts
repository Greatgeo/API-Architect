/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField } from 'sanity';

export const rateLimit = defineType({
  name: 'rateLimit',
  title: 'Rate Limit',
  type: 'object',
  fields: [
    defineField({
      name: 'requests',
      title: 'Requests Allowed',
      type: 'number',
      validation: (rule) =>
        rule.positive().integer().error('Requests count must be a positive integer'),
    }),
    defineField({
      name: 'window',
      title: 'Time Window',
      type: 'string',
      description: 'e.g. "1s", "1m", "1h", "1d"',
      validation: (rule) => rule.required().error('Time window is required'),
    }),
    defineField({
      name: 'scope',
      title: 'Rate Limit Scope',
      type: 'string',
      options: {
        list: [
          { title: 'Per IP Address', value: 'ip' },
          { title: 'Per API Key / Project', value: 'api_key' },
          { title: 'Global Endpoint Limit', value: 'endpoint' },
          { title: 'Global Account Pool', value: 'global' },
        ],
      },
      initialValue: 'api_key',
    }),
    defineField({
      name: 'description',
      title: 'Description & Burst Policy',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      requests: 'requests',
      window: 'window',
      scope: 'scope',
    },
    prepare({ requests, window, scope }) {
      return {
        title: `${requests || 'N/A'} requests / ${window || 'window'}`,
        subtitle: `Scope: ${scope || 'api_key'}`,
      };
    },
  },
});
