import { useId } from 'react';
import * as RS from '@radix-ui/react-select';
import '../TextField/TextField.css';
import './Select.css';

export interface SelectOption { value: string; label: string; disabled?: boolean; }
export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
}

export function Select({ label, options, placeholder = 'Select an option', helperText, error, id, disabled, ...root }: SelectProps) {
  const uid = useId();
  const triggerId = id ?? uid;
  const descId = `${triggerId}-desc`;
  const desc = error ?? helperText;
  return (
    <div className={['hb-field', error && 'hb-field--error'].filter(Boolean).join(' ')}>
      <label htmlFor={triggerId} className="hb-field__label">{label}</label>
      <RS.Root disabled={disabled} {...root}>
        <RS.Trigger id={triggerId} className="hb-select__trigger" aria-invalid={error ? true : undefined} aria-describedby={desc ? descId : undefined}>
          <RS.Value placeholder={placeholder} />
          <RS.Icon aria-hidden>▾</RS.Icon>
        </RS.Trigger>
        <RS.Portal>
          <RS.Content className="hb-select__content" position="popper" sideOffset={4}>
            <RS.Viewport className="hb-select__viewport">
              {options.map((o) => (
                <RS.Item key={o.value} value={o.value} disabled={o.disabled} className="hb-select__item">
                  <RS.ItemText>{o.label}</RS.ItemText>
                  <RS.ItemIndicator aria-hidden>✓</RS.ItemIndicator>
                </RS.Item>
              ))}
            </RS.Viewport>
          </RS.Content>
        </RS.Portal>
      </RS.Root>
      {desc && <p id={descId} className="hb-field__desc" role={error ? 'alert' : undefined}>{desc}</p>}
    </div>
  );
}
