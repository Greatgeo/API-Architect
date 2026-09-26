/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField } from 'sanity';

export const implementationStep = defineType({
  name: 'implementationStep',
  title: 'Implementation Step',
  type: 'object',
  fields: [
    defineField({
      name: 'order',
      title: 'Step Number',
      type: 'number',
      validation: (rule) =>
        rule.required().positive().integer().error('Step order must be a positive integer'),
    }),
    defineField({
      name: 'title',
      title: 'Step Title',
      type: 'string',
      validation: (rule) => rule.required().error('Step title is required'),
    }),
    defineField({
      name: 'description',
      title: 'Instructions / Guidance',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().error('Step instructions are required'),
    }),
  ],
  preview: {
    select: {
      order: 'order',
      title: 'title',
    },
    prepare({ order, title }) {
      return {
        title: `${order ? `#${order}` : 'Step'}: ${title}`,
      };
    },
  },
});
