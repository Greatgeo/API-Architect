/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const apiProduct = defineType({
  name: 'apiProduct',
  title: 'API Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'The formal name of the API Product or service (e.g. "Atlas Webhook Gateway").',
      validation: (rule) => rule.required().error('API Product name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Slug is required for API products'),
    }),
    defineField({
      name: 'provider',
      title: 'Provider / Organization',
      type: 'string',
      description: 'Vendor, protocol, or provider offering this API product.',
      validation: (rule) => rule.required().error('Provider name is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'High-level description of what the product provides.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Blockchain', value: 'blockchain' },
          { title: 'Wallet', value: 'wallet' },
          { title: 'Data', value: 'data' },
          { title: 'Analytics', value: 'analytics' },
          { title: 'Payments', value: 'payments' },
          { title: 'Identity', value: 'identity' },
          { title: 'Infrastructure', value: 'infrastructure' },
          { title: 'Developer Tools', value: 'developer-tools' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'blockchain',
      validation: (rule) => rule.required().error('Category is required'),
    }),
    defineField({
      name: 'status',
      title: 'Lifecycle Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active (Generally Available)', value: 'active' },
          { title: 'Beta (Public Preview)', value: 'beta' },
          { title: 'Deprecated', value: 'deprecated' },
          { title: 'Experimental', value: 'experimental' },
        ],
      },
      initialValue: 'active',
      validation: (rule) => rule.required().error('Lifecycle status is required'),
    }),
    defineField({
      name: 'currentVersion',
      title: 'Current Version',
      type: 'string',
      description: 'API version string (e.g. "v1.4.0", "2026-03").',
    }),
    defineField({
      name: 'documentationUrl',
      title: 'Documentation URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid HTTP/HTTPS URL'),
    }),
    defineField({
      name: 'authenticationMethods',
      title: 'Supported Authentication Methods',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              { title: 'API Key (Header / Query)', value: 'api_key' },
              { title: 'Bearer Token (JWT)', value: 'bearer' },
              { title: 'OAuth 2.0 Flow', value: 'oauth' },
              { title: 'HMAC Webhook Secret', value: 'webhook_secret' },
              { title: 'None (Public / Open)', value: 'none' },
              { title: 'Other', value: 'other' },
            ],
          },
        }),
      ],
      description: 'Authentication schemes accepted by this API product.',
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
      description: 'Networks explicitly supported by this product.',
    }),
    defineField({
      name: 'capabilities',
      title: 'Offered Capabilities',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'capability' }],
        }),
      ],
      description: 'Discrete capabilities provided across this product.',
    }),
    defineField({
      name: 'limitations',
      title: 'Known Product Limitations',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'limitation',
        }),
      ],
      description: 'Structured limitation records evaluated during compatibility reasoning.',
    }),
    defineField({
      name: 'isControlledDemo',
      title: 'Controlled Demo Record',
      type: 'boolean',
      initialValue: true,
      description: 'Flags whether this record belongs to the controlled demonstration dataset.',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      provider: 'provider',
      category: 'category',
      status: 'status',
    },
    prepare({ name, provider, category, status }) {
      return {
        title: name,
        subtitle: `${provider || 'Unknown Provider'} · ${category || 'general'} · ${status ? status.toUpperCase() : 'ACTIVE'}`,
      };
    },
  },
});
