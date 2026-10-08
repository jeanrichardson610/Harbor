import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import './Tabs.css';

export interface TabItem { id: string; label: string; panel: ReactNode; disabled?: boolean; }
export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  'aria-label'?: string;
}

/** Hand-rolled to the WAI-ARIA tabs pattern: roving tabindex, arrow keys, Home and End, automatic activation. */
export function Tabs({ tabs, value, defaultValue, onValueChange, 'aria-label': ariaLabel }: TabsProps) {
  const base = useId();
  const [inner, setInner] = useState(defaultValue ?? tabs.find((t) => !t.disabled)?.id);
  const active = value ?? inner;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const enabled = tabs.filter((t) => !t.disabled);

  const select = (id: string) => {
    setInner(id);
    onValueChange?.(id);
    refs.current[id]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const i = enabled.findIndex((t) => t.id === active);
    let next: number;
    if (e.key === 'ArrowRight') next = (i + 1) % enabled.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = enabled.length - 1;
    else return;
    e.preventDefault();
    select(enabled[next].id);
  };

  return (
    <div className="hb-tabs">
      <div role="tablist" aria-label={ariaLabel} className="hb-tabs__list" onKeyDown={onKeyDown}>
        {tabs.map((t) => (
          <button
            key={t.id} ref={(el) => { refs.current[t.id] = el; }} role="tab" className="hb-tabs__tab"
            id={`${base}-tab-${t.id}`} aria-controls={`${base}-panel-${t.id}`} aria-selected={t.id === active}
            tabIndex={t.id === active ? 0 : -1} disabled={t.disabled} onClick={() => select(t.id)}
          >{t.label}</button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" className="hb-tabs__panel" id={`${base}-panel-${t.id}`} aria-labelledby={`${base}-tab-${t.id}`} hidden={t.id !== active} tabIndex={0}>
          {t.id === active && t.panel}
        </div>
      ))}
    </div>
  );
}
