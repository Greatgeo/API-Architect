/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const network = defineType({
  name: 'network',
  title: 'Network',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Network Name',
      type: 'string',
      description: 'e.g. "Ethereum Mainnet", "Base", "Arbitrum One".',
      validation: (rule) => rule.required().error('Network name is required'),
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
      name: 'type',
      title: 'Network Architecture / Type',
      type: 'string',
      options: {
        list: [
          { title: 'EVM Layer 1 (e.g. Ethereum)', value: 'evm' },
          { title: 'Layer 2 Rollup (e.g. Base, Optimism, Arbitrum)', value: 'layer2' },
          { title: 'Sidechain (e.g. Polygon PoS)', value: 'sidechain' },
          { title: 'Non-EVM Protocol (e.g. Solana, Bitcoin)', value: 'non_evm' },
          { title: 'Other Infrastructure', value: 'other' },
        ],
      },
      initialValue: 'layer2',
      validation: (rule) => rule.required().error('Network type is required'),
    }),
    defineField({
      name: 'chainId',
      title: 'Chain ID',
      type: 'string',
      description: 'EVM Chain ID (e.g. "1" for Ethereum, "8453" for Base) or identifier string.',
    }),
    defineField({
      name: 'environment',
      title: 'Environment Stage',
      type: 'string',
      options: {
        list: [
          { title: 'Mainnet', value: 'mainnet' },
          { title: 'Testnet (Sepolia, Goerli, etc.)', value: 'testnet' },
          { title: 'Devnet / Local Sandbox', value: 'devnet' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'mainnet',
      validation: (rule) => rule.required().error('Environment is required'),
    }),
    defineField({
      name: 'supportedCapabilities',
      title: 'Supported Capabilities',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'capability' }],
        }),
      ],
      description: 'Capabilities verified to function reliably on this network.',
    }),
    defineField({
      name: 'limitations',
      title: 'Network Limitations & Quirks',
      type: 'array',
      of: [defineArrayMember({ type: 'limitation' })],
      description: 'Network-specific re-org depth, gas estimation peculiarities, or latency constraints.',
    }),
    defineField({
      name: 'documentationUrl',
      title: 'Official Documentation URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid HTTP/HTTPS URL'),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      type: 'type',
      environment: 'environment',
      chainId: 'chainId',
    },
    prepare({ name, type, environment, chainId }) {
      return {
        title: name,
        subtitle: `${(type || 'network').toUpperCase()} · ${environment || 'mainnet'} · Chain ID: ${chainId || 'N/A'}`,
      };
    },
  },
});
