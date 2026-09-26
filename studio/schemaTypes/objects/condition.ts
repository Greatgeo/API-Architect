/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField } from 'sanity';

export const condition = defineType({
  name: 'condition',
  title: 'Condition',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Condition Title',
      type: 'string',
      validation: (rule) => rule.required().error('Condition title is required'),
    }),
    defineField({
      name: 'description',
      title: 'Detailed Constraint / Condition',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isMandatory',
      title: 'Is Mandatory?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isMandatory: 'isMandatory',
    },
    prepare({ title, isMandatory }) {
      return {
        title,
        subtitle: isMandatory ? 'Mandatory Condition' : 'Optional Condition',
      };
    },
  },
});
