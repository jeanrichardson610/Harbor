interface Item { label: string; value: number; }

/** Horizontal bars. The numbers are real text, so the bars are decoration for sighted users only. */
export function BarList({ items, format }: { items: Item[]; format: (n: number) => string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="bars">
      {items.map((i) => (
        <li key={i.label}>
          <span className="bars__label">{i.label}</span>
          <span className="bars__track" aria-hidden="true"><span className="bars__fill" style={{ width: `${(i.value / max) * 100}%` }} /></span>
          <span className="bars__value">{format(i.value)}</span>
        </li>
      ))}
    </ul>
  );
}
