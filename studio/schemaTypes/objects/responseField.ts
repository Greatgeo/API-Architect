/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField } from 'sanity';

export const responseField = defineType({
  name: 'responseField',
  title: 'Response Field',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Field Name',
      type: 'string',
      validation: (rule) => rule.required().error('Response field name is required'),
    }),
    defineField({
      name: 'type',
      title: 'Field Type',
      type: 'string',
      validation: (rule) => rule.required().error('Response field type is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      type: 'type',
    },
    prepare({ name, type }) {
      return {
        title: name,
        subtitle: type,
      };
    },
  },
});
