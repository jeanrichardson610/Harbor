import tokens from '@harbor/tokens/tokens.json';
import contrast from '@harbor/tokens/contrast.json';

type Theme = 'light' | 'dark';
const t = tokens as Record<string, Record<string, string>>;
const resolve = (theme: Theme, key: string): { name: string; value: string } => {
  let v = t[theme][key] ?? t.primitive[key];
  let name = key;
  while (typeof v === 'string' && v.startsWith('{')) { name = v.slice(1, -1).replaceAll('.', '-'); v = t.primitive[name] ?? t[theme][name]; }
  return { name, value: v };
};

// Self-contained panel: sets its own background and text color from tokens, so it is readable
// whatever the surrounding Storybook docs page looks like.
const panel = {
  background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-default)',
  borderRadius: 12, padding: 16, overflowX: 'auto' as const,
};
const cell = { padding: '6px 10px', borderTop: '1px solid var(--color-border-default)', textAlign: 'left' as const };

export function Swatches({ theme }: { theme: Theme }) {
  return (
    <div style={{ ...panel, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
      {Object.keys(t[theme]).filter((k) => k.startsWith('color-')).map((k) => {
        const r = resolve(theme, k);
        return (
          <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ width: 36, height: 36, borderRadius: 8, background: r.value, border: '1px solid var(--color-border-default)', flex: 'none' }} />
            <span style={{ fontSize: 13, lineHeight: 1.3 }}>
              <code style={{ color: 'inherit' }}>--{k}</code><br />
              <span style={{ color: 'var(--color-text-muted)' }}>{r.name}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ContrastTable({ theme }: { theme: Theme }) {
  const rows = (contrast as Record<string, { name: string; fgValue: string; bgValue: string; ratio: number; min: number; pass: boolean }[]>)[theme];
  return (
    <div style={panel}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, color: 'inherit' }}>
        <thead><tr><th style={cell}>Pairing</th><th style={cell}>Sample</th><th style={cell}>Ratio</th><th style={cell}>Target</th><th style={cell}>Result</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td style={cell}>{r.name}</td>
              <td style={cell}><span style={{ background: r.bgValue, color: r.fgValue, padding: '2px 10px', borderRadius: 6, border: '1px solid var(--color-border-default)', fontWeight: 600 }}>Aa</span></td>
              <td style={cell}>{r.ratio}:1</td>
              <td style={cell}>{r.min}:1</td>
              <td style={cell}>{r.pass ? 'Pass' : 'Fail'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
