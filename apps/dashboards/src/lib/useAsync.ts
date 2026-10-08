import { useEffect, useState } from 'react';

const cache = new Map<string, unknown>();
interface State<T> { data?: T; error?: string; loading: boolean; }

/** Runs an async loader whenever `key` changes. Results are cached per key, so revisiting a tab is instant. */
export function useAsync<T>(key: string, load: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<State<T>>(() =>
    cache.has(key) ? { data: cache.get(key) as T, loading: false } : { loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (cache.has(key)) { setState({ data: cache.get(key) as T, loading: false }); return; }
    const ctrl = new AbortController();
    setState({ loading: true });
    load(ctrl.signal)
      .then((data) => { cache.set(key, data); setState({ data, loading: false }); })
      .catch((e: Error) => { if (e.name !== 'AbortError') setState({ error: e.message || 'The request failed.', loading: false }); });
    return () => ctrl.abort();
    // `load` is intentionally not a dependency: `key` identifies what it loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  return { ...state, retry: () => { cache.delete(key); setAttempt((n) => n + 1); } };
}