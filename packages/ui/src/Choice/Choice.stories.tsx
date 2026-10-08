import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Checkbox and Switch',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: [
    '**Checkbox** records a choice that is submitted later. **Switch** changes a setting right away, with no Save button.',
    '',
    '**Do** write labels as the thing being turned on: "Weather alerts". **Don\'t** use a switch inside a form that has a submit button.',
    '',
    '**Accessibility:** both are native checkboxes. The switch adds `role="switch"`, so Space toggles it and screen readers announce on or off. The whole label is the click target, at least 44px tall.',
  ].join('\n') } } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxDefault: Story = { args: { label: 'Send me the weekly manifest' } };
export const CheckboxChecked: Story = { args: { label: 'Send me the weekly manifest', defaultChecked: true } };
export const CheckboxDisabled: Story = { args: { label: 'Send me the weekly manifest', disabled: true } };
export const SwitchOn: Story = { render: () => <Switch label="Weather alerts" defaultChecked /> };
export const SwitchOff: Story = { render: () => <Switch label="Weather alerts" /> };
export const SwitchDisabled: Story = { render: () => <Switch label="Weather alerts" disabled /> };
