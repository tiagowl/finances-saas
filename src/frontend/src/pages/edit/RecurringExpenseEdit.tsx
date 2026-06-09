import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { recurringExpenseApi } from '../../services/api';
import { useCategoryStore } from '../../stores/categoryStore';
import { useToastStore } from '../../hooks/useToast';
import RecurringExpenseForm from '../../components/forms/RecurringExpenseForm';
import { TableSkeleton } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import type { RecurringExpense } from '../../types';

export default function RecurringExpenseEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.add);
  const { categories, fetch: fetchCategories } = useCategoryStore();
  const [item, setItem] = useState<RecurringExpense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    recurringExpenseApi.getById(id)
      .then(setItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    if (categories.length === 0) fetchCategories();
  }, [id]);

  const catOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const handleSubmit = async (data: { name: string; price: number; installments?: number | null; categoryId: string; notes?: string }) => {
    if (!id) return;
    await recurringExpenseApi.update(id, data);
    addToast('success', 'Despesa recorrente atualizada com sucesso!');
    navigate(`/expenses/recurring/${id}`);
  };

  if (loading) return <TableSkeleton rows={3} />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!item) return <ErrorState message="Despesa não encontrada." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Editar despesa recorrente</h1>
      </div>

      <RecurringExpenseForm
        initialData={item}
        categories={catOptions}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
