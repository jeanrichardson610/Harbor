import type { ReactNode } from 'react';
import './Alert.css';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  /** Say what happened in a few words: "Couldn't save changes". */
  title: string;
  /** Say what to do next. */
  children?: ReactNode;
}

export function Alert({ variant = 'info', title, children }: AlertProps) {
  const urgent = variant === 'danger' || variant === 'warning';
  return (
    <div className={`hb-alert hb-alert--${variant}`} role={urgent ? 'alert' : 'status'}>
      <strong className="hb-alert__title">{title}</strong>
      {children && <p className="hb-alert__body">{children}</p>}
    </div>
  );
}
