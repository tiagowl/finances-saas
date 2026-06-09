import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Pencil } from 'lucide-react';
import { categoryApi, occasionalExpenseApi, recurringExpenseApi, occasionalRevenueApi, recurringRevenueApi } from '../../services/api';
import { useToastStore } from '../../hooks/useToast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import PeriodFilter from '../../components/shared/PeriodFilter';
import CategoryForm from '../../components/forms/CategoryForm';
import type { Category } from '../../types';
import { format, parseISO } from 'date-fns';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

interface Transaction {
  id: string;
  name: string;
  price: number;
  date: string | null;
  type: 'Despesa' | 'Receita';
  kind: 'Avulsa' | 'Recorrente';
}

function getExpenseDetailPath(tx: Transaction): string | null {
  if (tx.type !== 'Despesa') return null;
  return tx.kind === 'Avulsa'
    ? `/expenses/occasional/${tx.id}`
    : `/expenses/recurring/${tx.id}`;
}

export default function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.add);
  const [category, setCategory] = useState<Category | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [period, setPeriod] = useState<{ startDate?: string; endDate?: string }>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [sortBy, sortOrder] = sortValue ? sortValue.split(':') as [string, string] : [undefined, undefined];
      const params = { categoryId: id, search: debouncedSearch || undefined, sortBy, sortOrder, ...period };

      const [cat, occExp, recExp, occRev, recRev] = await Promise.all([
        categoryApi.getById(id!),
        occasionalExpenseApi.list(params),
        recurringExpenseApi.list(params),
        occasionalRevenueApi.list(params),
        recurringRevenueApi.list(params),
      ]);

      setCategory(cat);

      const all: Transaction[] = [
        ...occExp.data.map((e) => ({ id: e.id, name: e.name, price: e.price, date: e.date, type: 'Despesa' as const, kind: 'Avulsa' as const })),
        ...recExp.data.map((e) => ({ id: e.id, name: e.name, price: e.price, date: null, type: 'Despesa' as const, kind: 'Recorrente' as const })),
        ...occRev.data.map((r) => ({ id: r.id, name: r.name, price: r.price, date: r.date, type: 'Receita' as const, kind: 'Avulsa' as const })),
        ...recRev.data.map((r) => ({ id: r.id, name: r.name, price: r.price, date: null, type: 'Receita' as const, kind: 'Recorrente' as const })),
      ];

      all.sort((a, b) => {
        if (!a.date && !b.date) return a.name.localeCompare(b.name);
        if (!a.date) return 1;
        if (!b.date) return -1;
        return parseISO(b.date).getTime() - parseISO(a.date).getTime();
      });

      setTransactions(all);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id, debouncedSearch, sortValue, period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalExpenses = transactions.filter((t) => t.type === 'Despesa').reduce((s, t) => s + t.price, 0);

  const handleEditSubmit = async (data: { name: string; notes?: string; maxBudget?: number }) => {
    if (!id) return;
    setSaving(true);
    try {
      const updated = await categoryApi.update(id, data);
      setCategory(updated);
      setModalOpen(false);
      addToast('success', 'Categoria atualizada com sucesso!');
    } catch (err) {
      addToast('error', 'Erro ao atualizar categoria.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !category) return <TableSkeleton rows={4} />;
  if (error && !category) return <ErrorState message={error} onRetry={fetchData} />;
  if (!category) return <ErrorState message="Categoria não encontrada." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/categories')} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{category.name}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-slate-500">Orçamento</p>
          <p className="text-xl font-bold text-slate-900">{category.maxBudget ? formatBRL(category.maxBudget) : 'Sem limite'}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Total despesas</p>
          <p className="text-xl font-bold text-red-600">{formatBRL(totalExpenses)}</p>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setModalOpen(true)} title="Editar">
          <Pencil className="w-4 h-4" /> Editar
        </Button>
      </div>

      {category.notes && (
        <Card>
          <p className="text-sm text-slate-500 mb-1">Anotações</p>
          <div className="text-sm text-slate-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: category.notes }} />
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="h-10 w-full pl-9 pr-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-primary-700"
          />
        </div>
        <select
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-primary-700"
        >
          <option value="">Mais recentes</option>
          <option value="price:desc">Maior valor</option>
          <option value="price:asc">Menor valor</option>
          <option value="name:asc">A-Z</option>
          <option value="name:desc">Z-A</option>
        </select>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      <Card title="Transações">
        {loading && <TableSkeleton rows={3} />}
        {!loading && transactions.length === 0 && (
          <p className="text-sm text-slate-500 py-4 text-center">Nenhuma transação nesta categoria.</p>
        )}
        {!loading && transactions.length > 0 && (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const detailPath = getExpenseDetailPath(tx);
              const isClickable = detailPath !== null;

              return (
                <div
                  key={tx.id}
                  onClick={isClickable ? () => navigate(detailPath) : undefined}
                  className={`flex items-center justify-between py-3 ${isClickable ? 'cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors' : ''}`}
                >
                  <div>
                    <p className={`text-sm font-medium ${isClickable ? 'text-primary-700' : 'text-slate-900'}`}>{tx.name}</p>
                    <p className="text-xs text-slate-500">
                      {tx.kind}
                      {tx.date && <> &middot; {format(parseISO(tx.date), 'dd/MM/yyyy')}</>}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'Despesa' ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.type === 'Despesa' ? '-' : '+'}{formatBRL(tx.price)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Editar categoria">
        <CategoryForm
          initialData={category}
          onSubmit={handleEditSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
