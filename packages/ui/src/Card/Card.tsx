import { useId, type ReactNode } from 'react';
import './Card.css';

export interface CardProps {
  title: string;
  description?: string;
  /** One action at most, such as a ghost Button, aligned to the top right. */
  actions?: ReactNode;
  children?: ReactNode;
}

/** A titled group of related content. Rendered as a labelled section so screen readers can jump to it. */
export function Card({ title, description, actions, children }: CardProps) {
  const id = useId();
  return (
    <section className="hb-card" aria-labelledby={id}>
      <div className="hb-card__head">
        <div>
          <h3 id={id} className="hb-card__title">{title}</h3>
          {description && <p className="hb-card__desc">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
