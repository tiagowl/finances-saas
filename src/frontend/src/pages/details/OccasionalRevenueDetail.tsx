import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { occasionalRevenueApi } from '../../services/api';
import { useCategoryStore } from '../../stores/categoryStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import { format, parseISO } from 'date-fns';
import type { OccasionalRevenue } from '../../types';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function OccasionalRevenueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, fetch: fetchCategories } = useCategoryStore();
  const [item, setItem] = useState<OccasionalRevenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    occasionalRevenueApi.getById(id)
      .then(setItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    if (categories.length === 0) fetchCategories();
  }, [id]);

  const categoryName = categories.find((c) => c.id === item?.categoryId)?.name || 'Sem categoria';

  if (loading) return <TableSkeleton rows={4} />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!item) return <ErrorState message="Receita não encontrada." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/revenues/occasional')} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Receita Avulsa</h1>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Nome</p>
              <p className="text-lg font-medium text-slate-900">{item.name}</p>
            </div>
            <span className="text-2xl font-bold text-green-600">{formatBRL(item.price)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Data</p>
              <p className="text-sm font-medium text-slate-900">{format(parseISO(item.date), 'dd/MM/yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Categoria</p>
              <p className="text-sm font-medium text-slate-900">{categoryName}</p>
            </div>
          </div>

          {item.notes && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Anotações</p>
              <div className="text-sm text-slate-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.notes }} />
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate(`/revenues/occasional/${id}/edit`)} title="Editar">
          <Pencil className="w-4 h-4" /> Editar
        </Button>
        <Button variant="danger" onClick={() => { navigate('/revenues/occasional'); }} title="Excluir">
          <Trash2 className="w-4 h-4" /> Excluir
        </Button>
      </div>
    </div>
  );
}
