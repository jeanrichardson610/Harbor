import { useId, type ReactNode } from 'react';
import './Table.css';

export interface Column<T> {
  key: string;
  header: string;
  /** Right-align numbers so digits line up. */
  align?: 'start' | 'end';
  render?: (row: T) => ReactNode;
}
export interface TableProps<T> {
  /** Required. Names the table for everyone, including screen reader users. */
  caption: string;
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Tells people what to do or why it is empty. */
  emptyMessage?: string;
}

export function Table<T extends Record<string, unknown>>({ caption, columns, rows, getRowId, emptyMessage = 'Nothing to show yet.' }: TableProps<T>) {
  const id = useId();
  return (
    <div className="hb-table-wrap" role="region" aria-labelledby={id} tabIndex={0}>
      <table className="hb-table">
        <caption id={id}>{caption}</caption>
        <thead>
          <tr>{columns.map((c) => <th key={c.key} scope="col" data-align={c.align}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="hb-table__empty">{emptyMessage}</td></tr>
          ) : rows.map((r) => (
            <tr key={getRowId(r)}>
              {columns.map((c) => <td key={c.key} data-align={c.align}>{c.render ? c.render(r) : String(r[c.key] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
