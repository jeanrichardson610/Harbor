import { useMemo, useState, type FormEvent } from 'react';
import { Badge, Button, Card, Dialog, DialogClose, Select, Switch, Table, TextField, useToast, type Column } from '@harbor/ui';
import { PageHeader } from '../components/PageHeader';
import { BarList } from '../components/BarList';
import { money, shortDate, signedMoney } from '../lib/format';

type Account = { id: string; name: string; balance: number };
type Txn = { id: string; date: string; description: string; category: string; amount: number; account: string };

const seedAccounts: Account[] = [
  { id: 'checking', name: 'Checking', balance: 4820.55 },
  { id: 'savings', name: 'Savings', balance: 12340 },
];
const seedTxns: Txn[] = [
  { id: 't1', date: '2026-10-03', description: 'Fresh Market', category: 'Groceries', amount: -84.2, account: 'Checking' },
  { id: 't2', date: '2026-10-02', description: 'Paycheck', category: 'Income', amount: 2450, account: 'Checking' },
  { id: 't3', date: '2026-10-02', description: 'Metro pass', category: 'Transport', amount: -64, account: 'Checking' },
  { id: 't4', date: '2026-10-01', description: 'Rent', category: 'Rent', amount: -1650, account: 'Checking' },
  { id: 't5', date: '2026-09-30', description: 'Noodle House', category: 'Dining', amount: -28.4, account: 'Checking' },
  { id: 't6', date: '2026-09-29', description: 'Streaming plan', category: 'Entertainment', amount: -15.99, account: 'Checking' },
  { id: 't7', date: '2026-09-28', description: 'Electric company', category: 'Utilities', amount: -112.35, account: 'Checking' },
  { id: 't8', date: '2026-09-27', description: 'Fresh Market', category: 'Groceries', amount: -61.75, account: 'Checking' },
  { id: 't9', date: '2026-09-26', description: 'Cinema', category: 'Entertainment', amount: -32, account: 'Checking' },
  { id: 't10', date: '2026-09-25', description: 'Interest', category: 'Income', amount: 18.4, account: 'Savings' },
];

export function Banking() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState(seedAccounts);
  const [txns, setTxns] = useState(seedTxns);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState('checking');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | undefined>();

  const show = (n: number) => (hidden ? '••••••' : money(n));
  const total = accounts.reduce((s, a) => s + a.balance, 0);
  const dest = accounts.find((a) => a.id !== from)!;
  const categories = useMemo(() => ['all', ...Array.from(new Set(txns.map((t) => t.category)))], [txns]);
  const filtered = useMemo(
    () => txns.filter((t) => (category === 'all' || t.category === category) && t.description.toLowerCase().includes(query.trim().toLowerCase())),
    [txns, query, category],
  );
  const spending = useMemo(() => {
    const m = new Map<string, number>();
    txns.filter((t) => t.amount < 0 && t.category !== 'Transfer').forEach((t) => m.set(t.category, (m.get(t.category) ?? 0) + Math.abs(t.amount)));
    return [...m].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [txns]);

  const columns: Column<Txn>[] = [
    { key: 'date', header: 'Date', render: (t) => shortDate(t.date) },
    { key: 'description', header: 'Description' },
    { key: 'category', header: 'Category', render: (t) => <Badge>{t.category}</Badge> },
    { key: 'account', header: 'Account' },
    { key: 'amount', header: 'Amount', align: 'end', render: (t) => (hidden ? '••••' : signedMoney(t.amount)) },
  ];

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    const src = accounts.find((a) => a.id === from)!;
    if (!amount.trim() || Number.isNaN(value) || value <= 0) { setError('Enter an amount greater than $0, like 250.00.'); return; }
    if (value > src.balance) { setError(`You can send up to ${money(src.balance)} from ${src.name}.`); return; }
    setAccounts((list) => list.map((a) => (a.id === src.id ? { ...a, balance: a.balance - value } : a.id === dest.id ? { ...a, balance: a.balance + value } : a)));
    const date = new Date().toISOString().slice(0, 10);
    setTxns((t) => [
      { id: crypto.randomUUID(), date, description: `Transfer to ${dest.name}`, category: 'Transfer', amount: -value, account: src.name },
      { id: crypto.randomUUID(), date, description: `Transfer from ${src.name}`, category: 'Transfer', amount: value, account: dest.name },
      ...t,
    ]);
    setOpen(false); setAmount(''); setError(undefined);
    toast({ title: 'Transfer sent', description: `${money(value)} moved to ${dest.name}.`, variant: 'success' });
  }

  return (
    <>
      <PageHeader
        title="Banking"
        description="Balances, spending, and transfers between your accounts."
        actions={
          <Dialog
            open={open}
            onOpenChange={(o) => { setOpen(o); if (!o) setError(undefined); }}
            trigger={<Button>Transfer money</Button>}
            title="Transfer money"
            description="Move money between your own accounts. It arrives right away."
            footer={<>
              <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
              <Button type="submit" form="transfer-form">Send transfer</Button>
            </>}
          >
            <form id="transfer-form" className="stack" onSubmit={submit} noValidate>
              <Select label="From" value={from} onValueChange={setFrom} options={accounts.map((a) => ({ value: a.id, label: `${a.name} (${money(a.balance)})` }))} />
              <p className="muted">To: {dest.name}</p>
              <TextField label="Amount (USD)" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} error={error} />
            </form>
          </Dialog>
        }
      />

      <div className="grid">
        <Card title="Total balance" description="All accounts"><p className="stat">{show(total)}</p></Card>
        {accounts.map((a) => (
          <Card key={a.id} title={a.name} description="Available balance"><p className="stat">{show(a.balance)}</p></Card>
        ))}
      </div>

      <div className="split">
        <Card title="Spending by category" description="From the transactions below">
          {spending.length ? <BarList items={spending} format={money} /> : <p className="muted">No spending yet.</p>}
        </Card>
        <Card title="Display">
          <Switch label="Hide balances" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
        </Card>
      </div>

      <div className="filters">
        <TextField label="Search transactions" type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select label="Category" value={category} onValueChange={setCategory} options={categories.map((c) => ({ value: c, label: c === 'all' ? 'All categories' : c }))} />
      </div>
      <Table caption="Recent transactions" columns={columns} rows={filtered} getRowId={(t) => t.id} emptyMessage="No transactions match your search. Clear the search or choose another category." />
    </>
  );
}
