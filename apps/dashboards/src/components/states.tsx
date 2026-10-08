import { Alert, Button } from '@harbor/ui';

export function Skeleton({ height = 20, width = '100%' }: { height?: number; width?: number | string }) {
  return <span className="skeleton" aria-hidden="true" style={{ height, width }} />;
}

/** Announces loading to screen readers and shows placeholder blocks. */
export function LoadingBlock({ label, rows = 3 }: { label: string; rows?: number }) {
  return (
    <div className="stack" aria-busy="true">
      <p className="sr-only" role="status">{label}</p>
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} height={i === 0 ? 32 : 20} width={i === 0 ? '40%' : '100%'} />)}
    </div>
  );
}

export function ErrorState({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) {
  return (
    <div className="stack">
      <Alert variant="danger" title={title}>{message} Check your connection and try again.</Alert>
      <div><Button variant="secondary" onClick={onRetry}>Try again</Button></div>
    </div>
  );
}
