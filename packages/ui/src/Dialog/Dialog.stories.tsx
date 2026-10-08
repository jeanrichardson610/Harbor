import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Dialog, DialogClose } from './Dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: [
    '**Anatomy:** overlay, title, optional description, content, footer actions, close button.',
    '',
    '**Do** use a dialog for decisions that need an answer now, such as confirming a destructive action. **Don\'t** put long forms in a dialog or open one on page load.',
    '',
    'Name the action in the title and match it on the button: the title "Delete route" pairs with a "Delete route" button, not "OK".',
    '',
    '**Accessibility:** focus moves into the dialog and returns to the trigger on close; Tab is trapped; Esc closes; the page behind is inert. Built on Radix Dialog.',
  ].join('\n') } } },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  args: {
    title: 'Delete route',
    description: 'This removes the route and its 12 scheduled sailings. You can’t undo this.',
    trigger: <Button variant="danger">Delete route</Button>,
    footer: (<>
      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
      <DialogClose asChild><Button variant="danger">Delete route</Button></DialogClose>
    </>),
  },
};
