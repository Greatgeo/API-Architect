/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const apiEndpoint = defineType({
  name: 'apiEndpoint',
  title: 'API Endpoint',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Endpoint Name',
      type: 'string',
      description: 'Human-readable name (e.g. "Stream Token Transfer Events").',
      validation: (rule) => rule.required().error('Endpoint name is required'),
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
      name: 'product',
      title: 'Parent API Product',
      type: 'reference',
      to: [{ type: 'apiProduct' }],
      validation: (rule) => rule.required().error('Parent API product reference is required'),
      description: 'The parent API product that provides this endpoint.',
    }),
    defineField({
      name: 'method',
      title: 'HTTP Method',
      type: 'string',
      options: {
        list: [
          { title: 'GET', value: 'GET' },
          { title: 'POST', value: 'POST' },
          { title: 'PUT', value: 'PUT' },
          { title: 'PATCH', value: 'PATCH' },
          { title: 'DELETE', value: 'DELETE' },
        ],
      },
      initialValue: 'POST',
      validation: (rule) => rule.required().error('HTTP method is required'),
    }),
    defineField({
      name: 'path',
      title: 'URI Path',
      type: 'string',
      description: 'Relative endpoint path (e.g. "/v1/tokens/transfers").',
      validation: (rule) => rule.required().error('Endpoint URI path is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'authentication',
      title: 'Authentication Schemes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              { title: 'API Key', value: 'api_key' },
              { title: 'Bearer Token', value: 'bearer' },
              { title: 'OAuth 2.0', value: 'oauth' },
              { title: 'Webhook HMAC Secret', value: 'webhook_secret' },
              { title: 'None (Public)', value: 'none' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'parameters',
      title: 'Request Parameters / Body Attributes',
      type: 'array',
      of: [defineArrayMember({ type: 'parameter' })],
      description: 'Structured input parameters required or accepted by this endpoint.',
    }),
    defineField({
      name: 'responseSchema',
      title: 'Response Schema Specification',
      type: 'object',
      fields: [
        defineField({
          name: 'summary',
          title: 'Response Summary',
          type: 'string',
          description: 'Overview of the response format and content.',
        }),
        defineField({
          name: 'fields',
          title: 'Key Response Fields',
          type: 'array',
          of: [defineArrayMember({ type: 'responseField' })],
        }),
      ],
    }),
    defineField({
      name: 'capabilities',
      title: 'Provided Capabilities',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'capability' }],
        }),
      ],
      description: 'Capabilities directly fulfilled by calling this endpoint.',
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
      description: 'Specific networks this endpoint can interact with.',
    }),
    defineField({
      name: 'rateLimit',
      title: 'Rate Limit Constraints',
      type: 'rateLimit',
    }),
    defineField({
      name: 'limitations',
      title: 'Endpoint-Specific Limitations',
      type: 'array',
      of: [defineArrayMember({ type: 'limitation' })],
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
      name: 'codeExamples',
      title: 'Code Examples',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'codeExample' }],
        }),
      ],
    }),
    defineField({
      name: 'documentationUrl',
      title: 'Documentation URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid HTTP/HTTPS URL'),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      method: 'method',
      path: 'path',
      productName: 'product.name',
    },
    prepare({ name, method, path, productName }) {
      return {
        title: `${method || 'HTTP'} ${path || '/'}`,
        subtitle: `${name || 'Endpoint'} · ${productName || 'No Product'}`,
      };
    },
  },
});
