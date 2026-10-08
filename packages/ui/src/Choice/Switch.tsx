import { forwardRef, type InputHTMLAttributes } from 'react';
import './Choice.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> { label: string; }

/** A switch applies immediately. If the change needs a Save button, use a Checkbox. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({ label, ...rest }, ref) {
  return (
    <label className="hb-choice">
      <input ref={ref} type="checkbox" role="switch" {...rest} />
      <span>{label}</span>
    </label>
  );
});
