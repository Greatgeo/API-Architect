/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const capability = defineType({
  name: 'capability',
  title: 'Capability',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Capability Identifier',
      type: 'string',
      description: 'Standardized capability code (e.g. "token_transfer_events", "wallet_balance").',
      validation: (rule) => rule.required().error('Capability name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Slug is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Clear explanation of what this technical capability achieves.',
      validation: (rule) => rule.required().error('Description is required'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Wallet Information', value: 'wallet' },
          { title: 'Transaction Monitoring / Trapping', value: 'transaction' },
          { title: 'Token Operations (ERC-20, etc.)', value: 'token' },
          { title: 'NFT Metadata & Balances', value: 'nft' },
          { title: 'Contract Event Logging', value: 'events' },
          { title: 'Direct Node RPC Access', value: 'rpc' },
          { title: 'Analytics & Indexing', value: 'analytics' },
          { title: 'Webhook Delivery Engine', value: 'webhooks' },
          { title: 'Portfolio Aggregation', value: 'portfolio' },
          { title: 'Other Capability', value: 'other' },
        ],
      },
      initialValue: 'events',
      validation: (rule) => rule.required().error('Capability category is required'),
    }),
    defineField({
      name: 'requirements',
      title: 'Operational Requirements',
      type: 'array',
      of: [defineArrayMember({ type: 'requirement' })],
      description: 'Prerequisites (e.g. webhook receiver endpoint, auth tier) needed to invoke this capability.',
    }),
    defineField({
      name: 'supportedNetworks',
      title: 'Supported Networks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'network' }],
        }),
      ],
      description: 'Networks where this capability has been verified.',
    }),
    defineField({
      name: 'compatibleEndpoints',
      title: 'Compatible API Endpoints',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'apiEndpoint' }],
        }),
      ],
      description: 'Endpoints capable of fulfilling this capability.',
    }),
    defineField({
      name: 'limitations',
      title: 'Known Limitations',
      type: 'array',
      of: [defineArrayMember({ type: 'limitation' })],
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
  ],
  preview: {
    select: {
      name: 'name',
      category: 'category',
      description: 'description',
    },
    prepare({ name, category, description }) {
      return {
        title: name,
        subtitle: `${category ? category.toUpperCase() : 'GENERAL'} · ${description ? description.slice(0, 50) + '...' : ''}`,
      };
    },
  },
});
