import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const options = [
  { value: 'la', label: 'Los Angeles' }, { value: 'sea', label: 'Seattle' },
  { value: 'oak', label: 'Oakland' }, { value: 'hnl', label: 'Honolulu', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Departure port', options },
  parameters: { docs: { description: { component: [
    'Use Select for 5 to 15 mutually exclusive options. Fewer than 5: use radio buttons. More than 15: add search.',
    '',
    '**Keyboard:** Enter, Space or Arrow keys open the list; arrows move; type to jump to an option; Enter selects; Esc closes.',
    '',
    'Built on Radix Select for listbox semantics and focus management. Styling comes entirely from Harbor tokens.',
  ].join('\n') } } },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: 'sea' } };
export const Error: Story = { args: { error: 'Choose a departure port to continue.' } };
export const Disabled: Story = { args: { disabled: true } };
