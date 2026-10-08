import { forwardRef, type InputHTMLAttributes } from 'react';
import './Choice.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> { label: string; }

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, ...rest }, ref) {
  return (
    <label className="hb-choice">
      <input ref={ref} type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
});
