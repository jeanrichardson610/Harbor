import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Scheduled' },
  parameters: { docs: { description: { component: [
    'A badge labels the state of something nearby. **Do** use one or two words: "Docked", "Delayed". **Don\'t** rely on color alone, so every badge carries its status as text.',
    '',
    'Badges are not interactive. For actions, use a Button.',
  ].join('\n') } } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge>Draft</Badge><Badge variant="brand">Scheduled</Badge><Badge variant="success">Docked</Badge>
      <Badge variant="warning">Delayed</Badge><Badge variant="danger">Cancelled</Badge>
    </div>
  ),
};
