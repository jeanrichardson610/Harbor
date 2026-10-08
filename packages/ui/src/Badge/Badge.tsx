import type { HTMLAttributes } from 'react';
import './Badge.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Meaning, not decoration. The label must say the status in words. */
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
}

export function Badge({ variant = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={['hb-badge', `hb-badge--${variant}`, className].filter(Boolean).join(' ')} {...rest} />;
}
