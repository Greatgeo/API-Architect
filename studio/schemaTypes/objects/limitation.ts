/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineType, defineField } from 'sanity';

export const limitation = defineType({
  name: 'limitation',
  title: 'Limitation',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().error('Limitation title is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().error('Limitation description is required'),
    }),
    defineField({
      name: 'severity',
      title: 'Severity',
      type: 'string',
      options: {
        list: [
          { title: 'Info — Informational notice only', value: 'info' },
          { title: 'Warning — Degraded performance or conditional caveat', value: 'warning' },
          { title: 'Blocking — Prevents implementation or unsupported combination', value: 'blocking' },
        ],
        layout: 'radio',
      },
      initialValue: 'warning',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      severity: 'severity',
    },
    prepare({ title, severity }) {
      return {
        title,
        subtitle: `Severity: ${severity ? severity.toUpperCase() : 'WARNING'}`,
      };
    },
  },
});
