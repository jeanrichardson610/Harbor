import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Vessel name' },
  parameters: { docs: { description: { component: [
    '**Anatomy:** label, input, helper or error text.',
    '',
    '**Do** keep labels visible and specific. **Do** say how to fix an error: "Enter a 5-letter port code, like USLAX."',
    "**Don't** use the placeholder as the label, or write errors that only say what went wrong.",
    '',
    '**Accessibility:** the label is bound with `htmlFor`; helper and error text are linked with `aria-describedby`; errors set `aria-invalid` and announce through `role="alert"`.',
  ].join('\n') } } },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHelper: Story = { args: { helperText: 'Shown on every manifest.' } };
export const Error: Story = { args: { label: 'Port code', defaultValue: 'LA', error: 'Enter a 5-letter port code, like USLAX.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Marigold' } };
