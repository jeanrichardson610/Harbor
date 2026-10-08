import { useEffect, useState } from 'react';

interface State<T> { data?: T; error?: string; loading: boolean; }

/** Fetches JSON. Pass null to skip. Cancels stale requests and exposes retry(). */
export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<State<T>>({ loading: url !== null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!url) { setState({ loading: false }); return; }
    const ctrl = new AbortController();
    setState({ loading: true });
    fetch(url, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`The server answered with status ${r.status}.`); return r.json() as Promise<T>; })
      .then((data) => setState({ data, loading: false }))
      .catch((e: Error) => { if (e.name !== 'AbortError') setState({ error: e.message || 'The request failed.', loading: false }); });
    return () => ctrl.abort();
  }, [url, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
