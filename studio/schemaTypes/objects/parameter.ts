/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField } from 'sanity';

export const parameter = defineType({
  name: 'parameter',
  title: 'Parameter',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Parameter Name',
      type: 'string',
      validation: (rule) => rule.required().error('Parameter name is required'),
    }),
    defineField({
      name: 'type',
      title: 'Data Type',
      type: 'string',
      options: {
        list: [
          { title: 'String', value: 'string' },
          { title: 'Number / Integer', value: 'number' },
          { title: 'Boolean', value: 'boolean' },
          { title: 'Object (JSON)', value: 'object' },
          { title: 'Array', value: 'array' },
          { title: 'Header', value: 'header' },
          { title: 'Query Parameter', value: 'query' },
        ],
      },
      initialValue: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'required',
      title: 'Is Required?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'example',
      title: 'Example Value',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      type: 'type',
      required: 'required',
    },
    prepare({ name, type, required }) {
      return {
        title: name,
        subtitle: `${type} · ${required ? 'Required' : 'Optional'}`,
      };
    },
  },
});
