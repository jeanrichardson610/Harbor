import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import './TextField.css';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Always visible. Placeholders are not labels. */
  label: string;
  helperText?: string;
  /** Error message. Replaces helper text and marks the field invalid. */
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, helperText, error, id, className, ...rest },
  ref,
) {
  const uid = useId();
  const inputId = id ?? uid;
  const descId = `${inputId}-desc`;
  const desc = error ?? helperText;
  return (
    <div className={['hb-field', error && 'hb-field--error', className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className="hb-field__label">{label}</label>
      <input ref={ref} id={inputId} className="hb-field__input" aria-invalid={error ? true : undefined} aria-describedby={desc ? descId : undefined} {...rest} />
      {desc && <p id={descId} className="hb-field__desc" role={error ? 'alert' : undefined}>{desc}</p>}
    </div>
  );
});
