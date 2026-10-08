// Measures WCAG contrast for every foreground/background pairing Harbor ships, in both themes.
// Writes dist/contrast.json for the docs and exits 1 if any pairing misses its target.
import { readFileSync, writeFileSync } from 'node:fs';

const t = JSON.parse(readFileSync(new URL('./dist/tokens.json', import.meta.url), 'utf8'));
const resolve = (theme, key) => {
  let v = t[theme][key] ?? t.primitive[key];
  while (typeof v === 'string' && v.startsWith('{')) { const k = v.slice(1, -1).replaceAll('.', '-'); v = t.primitive[k] ?? t[theme][k]; }
  return v;
};
function toRgb(c) {
  c = c.trim();
  if (c[0] === '#') { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  const m = c.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!m) throw new Error('Unsupported color ' + c);
  const h = +m[1], s = +m[2] / 100, l = +m[3] / 100, a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
  return [f(0), f(8), f(4)];
}
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(toRgb(a)), lum(toRgb(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [label, foreground token, background token, minimum ratio]  (4.5 = text, 3 = UI components and focus)
const pairs = [
  ['Body text on surface', 'color-text-primary', 'color-bg-surface', 4.5],
  ['Body text on canvas', 'color-text-primary', 'color-bg-canvas', 4.5],
  ['Muted text on surface', 'color-text-muted', 'color-bg-surface', 4.5],
  ['Muted text on canvas', 'color-text-muted', 'color-bg-canvas', 4.5],
  ['Error text on surface', 'color-text-danger', 'color-bg-surface', 4.5],
  ['Error text on canvas', 'color-text-danger', 'color-bg-canvas', 4.5],
  ['Primary button label', 'color-action-primary-fg', 'color-action-primary-bg', 4.5],
  ['Secondary button label', 'color-action-secondary-fg', 'color-action-secondary-bg', 4.5],
  ['Danger button label', 'color-feedback-danger-fg', 'color-feedback-danger-bg', 4.5],
  ['Success badge and alert', 'color-feedback-success-fg', 'color-feedback-success-bg', 4.5],
  ['Warning badge and alert', 'color-feedback-warning-fg', 'color-feedback-warning-bg', 4.5],
  ['Error badge and alert', 'color-text-danger', 'color-feedback-danger-soft', 4.5],
  ['Toast text', 'color-text-inverse', 'color-bg-inverse', 4.5],
  ['Input border', 'color-border-input', 'color-bg-input', 3],
  ['Switch track on surface', 'color-border-input', 'color-bg-surface', 3],
  ['Primary button edge on surface', 'color-action-primary-bg', 'color-bg-surface', 3],
  ['Focus ring on surface', 'color-focus-ring', 'color-bg-surface', 3],
  ['Focus ring on canvas', 'color-focus-ring', 'color-bg-canvas', 3],
];
const out = {}; let failed = 0;
for (const theme of ['light', 'dark']) {
  out[theme] = pairs.map(([name, fg, bg, min]) => {
    const r = ratio(resolve(theme, fg), resolve(theme, bg));
    const pass = r >= min; if (!pass) failed++;
    return { name, fg, bg, fgValue: resolve(theme, fg), bgValue: resolve(theme, bg), ratio: Math.round(r * 100) / 100, min, pass };
  });
}
writeFileSync(new URL('./dist/contrast.json', import.meta.url), JSON.stringify(out, null, 2));
for (const theme of ['light', 'dark']) for (const r of out[theme]) if (!r.pass) console.error(`FAIL ${theme}: ${r.name} ${r.ratio}:1 (needs ${r.min}:1)`);
console.log(`contrast: ${pairs.length * 2 - failed}/${pairs.length * 2} pairings pass`);
process.exit(failed ? 1 : 0);
