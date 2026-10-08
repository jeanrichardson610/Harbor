import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { ToastProvider, useToast } from './Toast';

function Demo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ title: 'Saved', variant: 'success' })}>Save changes</Button>
      <Button variant="ghost" onClick={() => toast({ title: 'Couldn’t save changes', description: 'The port code is missing.', variant: 'danger' })}>Trigger error</Button>
    </div>
  );
}

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
  parameters: { docs: { description: { component: [
    'A toast confirms an action that just happened. Use the same verb as the button: "Save changes" produces "Saved".',
    '',
    '**Do** keep toasts short. **Don\'t** use one for anything the person must act on. Use an Alert. Errors stay until dismissed, because a disappearing message can be missed.',
    '',
    '**Accessibility:** toasts appear in a polite live region, so screen readers announce them without moving focus. The dismiss button is 44px.',
    '',
    '**Known limitation:** toasts do not yet pause on hover.',
  ].join('\n') } } },
} satisfies Meta<typeof ToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Demo /> };
