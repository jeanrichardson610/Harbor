import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: { title: 'Fleet status', description: 'Updated 4 minutes ago', children: <p style={{ margin: 0 }}>12 vessels are active.</p> },
  parameters: { docs: { description: { component: [
    'A card groups content about one thing. **Do** give every card a title. **Don\'t** nest cards or make a whole card clickable. Put a Button inside instead.',
  ].join('\n') } } },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = { args: { actions: <Button variant="ghost" size="sm">View all</Button> } };
