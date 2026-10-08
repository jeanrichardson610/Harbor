import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { title: 'Route published', children: 'Crews can see the new schedule now.' },
  parameters: { docs: { description: { component: [
    'An alert stays on the page until the situation changes. For brief confirmations, use a Toast.',
    '',
    '**Do** explain the problem and the fix: "The port code is missing. Add it and save again." **Don\'t** apologize or write only "Something went wrong".',
    '',
    '**Accessibility:** warning and danger use `role="alert"` so they are announced immediately; info and success use `role="status"`, which waits for a pause.',
  ].join('\n') } } },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { variant: 'success' } };
export const Warning: Story = { args: { variant: 'warning', title: 'Storm expected at Port Hale', children: 'Arrivals may slip by up to 6 hours.' } };
export const Danger: Story = { args: { variant: 'danger', title: 'Couldn’t save changes', children: 'The port code is missing. Add it and save again.' } };
