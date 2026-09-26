/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export const codeExample = defineType({
  name: 'codeExample',
  title: 'Code Example',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Example Title',
      type: 'string',
      description: 'e.g. "TypeScript Webhook Handler with Signature Verification".',
      validation: (rule) => rule.required().error('Example title is required'),
    }),
    defineField({
      name: 'language',
      title: 'Programming Language',
      type: 'string',
      options: {
        list: [
          { title: 'TypeScript', value: 'typescript' },
          { title: 'JavaScript (Node.js)', value: 'javascript' },
          { title: 'Python', value: 'python' },
          { title: 'PHP', value: 'php' },
          { title: 'cURL / Shell', value: 'curl' },
          { title: 'Other Language', value: 'other' },
        ],
      },
      initialValue: 'typescript',
      validation: (rule) => rule.required().error('Programming language is required'),
    }),
    defineField({
      name: 'framework',
      title: 'Framework / Library Context',
      type: 'string',
      description: 'e.g. "Express 4", "Next.js App Router", "FastAPI".',
    }),
    defineField({
      name: 'endpoint',
      title: 'Associated API Endpoint',
      type: 'reference',
      to: [{ type: 'apiEndpoint' }],
      description: 'The endpoint this code example demonstrates.',
    }),
    defineField({
      name: 'description',
      title: 'Snippet Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'code',
      title: 'Executable / Reference Code',
      type: 'text',
      rows: 14,
      validation: (rule) => rule.required().error('Code content is required'),
      description: 'Raw reference code illustrating the implementation pattern.',
    }),
    defineField({
      name: 'prerequisites',
      title: 'Required Packages & Setup',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'e.g. "npm install express crypto dotenv".',
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
      title: 'title',
      language: 'language',
      framework: 'framework',
    },
    prepare({ title, language, framework }) {
      return {
        title,
        subtitle: `${(language || 'code').toUpperCase()} · ${framework || 'Standard'}`,
      };
    },
  },
});
