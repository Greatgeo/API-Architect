/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField } from 'sanity';

export const conflict = defineType({
  name: 'conflict',
  title: 'Conflict',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Conflict Title',
      type: 'string',
      validation: (rule) => rule.required().error('Conflict title is required'),
    }),
    defineField({
      name: 'description',
      title: 'Conflict Explanation',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'workaround',
      title: 'Suggested Workaround / Resolution',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare({ title, description }) {
      return {
        title,
        subtitle: description || 'No description provided',
      };
    },
  },
});
