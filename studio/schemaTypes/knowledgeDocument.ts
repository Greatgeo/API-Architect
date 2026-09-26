/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const knowledgeDocument = defineType({
  name: 'knowledgeDocument',
  title: 'Knowledge Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Document Title',
      type: 'string',
      description: 'Title of the architectural knowledge base guide or reference article.',
      validation: (rule) => rule.required().error('Title is required'),
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Architecture & System Design', value: 'architecture' },
          { title: 'API Selection & Evaluation', value: 'selection' },
          { title: 'Network Protocols & Execution', value: 'protocols' },
          { title: 'Security & Credential Management', value: 'security' },
          { title: 'Reliability & Troubleshooting', value: 'troubleshooting' },
          { title: 'Integration Patterns', value: 'integration' },
        ],
      },
      initialValue: 'architecture',
      validation: (rule) => rule.required().error('Category is required'),
    }),
    defineField({
      name: 'summary',
      title: 'Executive Summary',
      type: 'text',
      rows: 3,
      description: 'Concise summary of the concept, trade-offs, and decision matrix.',
      validation: (rule) => rule.required().error('Summary is required'),
    }),
    defineField({
      name: 'content',
      title: 'Article Content (Markdown)',
      type: 'text',
      rows: 15,
      description: 'Comprehensive, structured architectural prose for Knowledge Base indexing and context retrieval.',
      validation: (rule) => rule.required().error('Content is required'),
    }),
    defineField({
      name: 'topics',
      title: 'Topic Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Semantic tags (e.g. "webhooks", "l2-latency", "rate-limits").',
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
      name: 'relatedNetworks',
      title: 'Related Networks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'network' }],
        }),
      ],
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related API Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'apiProduct' }],
        }),
      ],
    }),
    defineField({
      name: 'relatedTechnologies',
      title: 'Related Technologies',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'technology' }],
        }),
      ],
    }),
    defineField({
      name: 'source',
      title: 'Document Source & Provenance',
      type: 'string',
      initialValue: 'Controlled demo dataset - Architectural Guidance',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isControlledDemo',
      title: 'Controlled Demo Record',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
    },
    prepare({ title, category }) {
      return {
        title,
        subtitle: `Category: ${(category || 'architecture').toUpperCase()}`,
      };
    },
  },
});
