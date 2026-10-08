import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import './Toast.css';

export type ToastVariant = 'default' | 'success' | 'danger';
export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before it closes. 0 keeps it until dismissed. Errors default to 0. */
  duration?: number;
}
interface ToastItem { id: number; title: string; description?: string; variant: ToastVariant; }

const Ctx = createContext<{ toast: (o: ToastOptions) => void } | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be used inside <ToastProvider>');
  return c;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const next = useRef(0);
  const dismiss = useCallback((id: number) => setItems((l) => l.filter((i) => i.id !== id)), []);
  const toast = useCallback(({ variant = 'default', duration, ...rest }: ToastOptions) => {
    const id = next.current++;
    setItems((l) => [...l, { id, variant, ...rest }]);
    const ms = duration ?? (variant === 'danger' ? 0 : 5000);
    if (ms > 0) setTimeout(() => dismiss(id), ms);
  }, [dismiss]);
  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="hb-toasts" role="region" aria-label="Notifications" aria-live="polite">
        {items.map((i) => (
          <div key={i.id} className={`hb-toast hb-toast--${i.variant}`}>
            <div><strong>{i.title}</strong>{i.description && <p>{i.description}</p>}</div>
            <button aria-label="Dismiss notification" onClick={() => dismiss(i.id)}>×</button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
