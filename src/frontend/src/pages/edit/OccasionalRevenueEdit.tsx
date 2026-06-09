import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { occasionalRevenueApi } from '../../services/api';
import { useToastStore } from '../../hooks/useToast';
import OccasionalRevenueForm from '../../components/forms/OccasionalRevenueForm';
import { TableSkeleton } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import type { OccasionalRevenue } from '../../types';

export default function OccasionalRevenueEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.add);
  const [item, setItem] = useState<OccasionalRevenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    occasionalRevenueApi.getById(id)
      .then(setItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: { name: string; price: number; date: string; notes?: string }) => {
    if (!id) return;
    await occasionalRevenueApi.update(id, data);
    addToast('success', 'Receita avulsa atualizada com sucesso!');
    navigate(`/revenues/occasional/${id}`);
  };

  if (loading) return <TableSkeleton rows={4} />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!item) return <ErrorState message="Receita não encontrada." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Editar receita avulsa</h1>
      </div>

      <OccasionalRevenueForm
        initialData={item}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
