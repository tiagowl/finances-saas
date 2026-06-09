import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useDashboardStore } from '../stores/dashboardStore';
import { useCategoryStore } from '../stores/categoryStore';
import StatCard from '../components/shared/StatCard';
import Card from '../components/ui/Card';
import PeriodFilter from '../components/shared/PeriodFilter';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import { format, parseISO } from 'date-fns';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, loading, error, fetch } = useDashboardStore();
  const { categories, fetch: fetchCategories } = useCategoryStore();
  const [period, setPeriod] = useState<{ startDate?: string; endDate?: string }>({
    startDate: startOfMonth(new Date()).toISOString(),
    endDate: endOfMonth(new Date()).toISOString(),
  });

  const goToTransaction = (tx: { id: string; type: string }) => {
    const base = tx.type === 'expense' ? 'expenses' : 'revenues';
    navigate(`/${base}/occasional/${tx.id}`);
  };

  useEffect(() => {
    fetch(period);
    if (categories.length === 0) fetchCategories();
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      {error && <ErrorState message={error} onRetry={() => fetch(period)} />}

      {loading && !stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard title="Desp. Avulsas" value={formatBRL(stats.totalOccasionalExpenses)} type="expense" />
            <StatCard title="Desp. Recorrentes" value={formatBRL(stats.totalRecurringExpenses)} type="expense" />
            <StatCard title="Rec. Avulsas" value={formatBRL(stats.totalOccasionalRevenues)} type="revenue" />
            <StatCard title="Rec. Recorrentes" value={formatBRL(stats.totalRecurringRevenues)} type="revenue" />
          </div>

          <StatCard
            title="Saldo"
            value={formatBRL(stats.balance)}
            type={stats.balance >= 0 ? 'revenue' : 'expense'}
          />

          <Card title="Últimas transações">
            {loading && <TableSkeleton rows={3} />}
            {stats.lastTransactions.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">Nenhuma transação registrada.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.lastTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => goToTransaction(tx)}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tx.name}</p>
                      <p className="text-xs text-slate-500">{tx.categoryName} &middot; {format(parseISO(tx.date), 'dd/MM/yyyy')}</p>
                    </div>
                    <span className={`text-sm font-semibold ${tx.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.type === 'expense' ? '-' : '+'}{formatBRL(tx.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {!loading && !error && !stats && (
        <p className="text-sm text-slate-500 text-center py-8">Nenhum dado disponível.</p>
      )}
    </div>
  );
}
