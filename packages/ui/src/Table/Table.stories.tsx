import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../Badge/Badge';
import { Table } from './Table';

type Row = { id: string; vessel: string; status: 'Docked' | 'Delayed'; load: number };
const rows: Row[] = [
  { id: '1', vessel: 'Marigold', status: 'Docked', load: 82 },
  { id: '2', vessel: 'Tern', status: 'Delayed', load: 64 },
  { id: '3', vessel: 'Halyard', status: 'Docked', load: 91 },
];
const columns = [
  { key: 'vessel', header: 'Vessel' },
  { key: 'status', header: 'Status', render: (r: Row) => <Badge variant={r.status === 'Docked' ? 'success' : 'warning'}>{r.status}</Badge> },
  { key: 'load', header: 'Load (%)', align: 'end' as const },
];

const meta = {
  title: 'Components/Table',
  component: Table<Row>,
  tags: ['autodocs'],
  args: { caption: 'Fleet status', columns, rows, getRowId: (r: Row) => r.id },
  parameters: { docs: { description: { component: [
    'Use a table for data people compare across rows. **Do** write a caption and right-align numbers. **Don\'t** use a table for layout.',
    '',
    '**Accessibility:** a real `<table>` with a caption, `scope="col"` headers, and a focusable scroll region so keyboard users can scroll wide tables.',
    '',
    '**Known limitation:** no sorting, selection, or pagination yet.',
  ].join('\n') } } },
} satisfies Meta<typeof Table<Row>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { rows: [], emptyMessage: 'No vessels yet. Add one to see its status here.' } };
