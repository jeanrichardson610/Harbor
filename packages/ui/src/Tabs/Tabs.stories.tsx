import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const tabs = [
  { id: 'overview', label: 'Overview', panel: <p>12 vessels are active in your fleet.</p> },
  { id: 'crew', label: 'Crew', panel: <p>34 crew members are assigned this week.</p> },
  { id: 'cargo', label: 'Cargo', panel: <p>8 containers are waiting for customs.</p> },
  { id: 'archive', label: 'Archive', panel: <p>Archived trips.</p>, disabled: true },
];

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { tabs, 'aria-label': 'Fleet sections' },
  parameters: { docs: { description: { component: [
    'Tabs switch between views of the same content. **Don\'t** use them for steps in a process or for page navigation.',
    '',
    '**Keyboard:** Tab moves focus into the tab list, then to the active panel. Left and Right Arrow move between tabs, Home and End jump to the first and last. Disabled tabs are skipped.',
    '',
    'Hand-rolled to the WAI-ARIA tabs pattern with no dependencies, using a roving `tabindex` and automatic activation.',
  ].join('\n') } } },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SecondSelected: Story = { args: { defaultValue: 'crew' } };
