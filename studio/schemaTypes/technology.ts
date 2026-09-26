/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const technology = defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Technology Name',
      type: 'string',
      description: 'e.g. "Node.js", "Express", "Next.js", "Python", "FastAPI".',
      validation: (rule) => rule.required().error('Technology name is required'),
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Programming Language', value: 'language' },
          { title: 'Application Framework', value: 'framework' },
          { title: 'Server / Execution Runtime', value: 'runtime' },
          { title: 'Cloud / Serverless Platform', value: 'cloud' },
          { title: 'SDK / Client Library', value: 'library' },
          { title: 'Database / Storage', value: 'database' },
          { title: 'Other Technology', value: 'other' },
        ],
      },
      initialValue: 'framework',
      validation: (rule) => rule.required().error('Category is required'),
    }),
    defineField({
      name: 'version',
      title: 'Supported / Targeted Version',
      type: 'string',
      description: 'e.g. ">= 20.0.0", "v4.x", "19.x".',
    }),
    defineField({
      name: 'runtime',
      title: 'Underlying Runtime',
      type: 'string',
      description: 'e.g. "V8", "Node.js 22", "CPython 3.12", "Edge Worker".',
    }),
    defineField({
      name: 'deploymentTargets',
      title: 'Compatible Deployment Targets',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'e.g. "Vercel", "AWS ECS", "Cloud Run", "Docker".',
    }),
    defineField({
      name: 'supportedFeatures',
      title: 'Supported Architectural Features',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'e.g. "WebSocket persistent connections", "Edge streaming", "Raw body HMAC verification".',
    }),
    defineField({
      name: 'limitations',
      title: 'Known Platform Limitations',
      type: 'array',
      of: [defineArrayMember({ type: 'limitation' })],
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
      category: 'category',
      version: 'version',
    },
    prepare({ name, category, version }) {
      return {
        title: name,
        subtitle: `${category ? category.toUpperCase() : 'TECH'} · Version: ${version || 'Any'}`,
      };
    },
  },
});
