import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRevenueStore } from '../stores/revenueStore';
import { useToastStore } from '../hooks/useToast';
import { Search } from 'lucide-react';
import DataTable from '../components/shared/DataTable';
import PeriodFilter from '../components/shared/PeriodFilter';
import Pagination from '../components/shared/Pagination';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { TableSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import OccasionalRevenueForm from '../components/forms/OccasionalRevenueForm';
import { format, parseISO } from 'date-fns';
import type { OccasionalRevenue } from '../types';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function OccasionalRevenues() {
  const navigate = useNavigate();
  const { occasional, occasionalTotal, occasionalCount, occasionalPage, loading, error, fetchOccasional, createOccasional, updateOccasional, removeOccasional } = useRevenueStore();
  const addToast = useToastStore((s) => s.add);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<OccasionalRevenue | null>(null);
  const [deleteItem, setDeleteItem] = useState<OccasionalRevenue | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [period, setPeriod] = useState<{ startDate?: string; endDate?: string }>({});
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [period, sortValue]);

  useEffect(() => {
    const [sortBy, sortOrder] = sortValue ? sortValue.split(':') as [string, string] : [undefined, undefined];
    fetchOccasional(getParams());
  }, [period, debouncedSearch, sortValue, page]);

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'price', label: 'Valor', render: (v: unknown) => <span className="font-medium">{formatBRL(v as number)}</span> },
    { key: 'date', label: 'Data', render: (v: unknown) => format(parseISO(v as string), 'dd/MM/yyyy') },
  ];

  const openCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: OccasionalRevenue) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSubmit = async (data: Parameters<typeof createOccasional>[0]) => {
    if (editItem) {
      await updateOccasional(editItem.id, data);
      addToast('success', 'Receita avulsa atualizada com sucesso!');
    } else {
      await createOccasional(data);
      addToast('success', 'Receita avulsa criada com sucesso!');
    }
    setModalOpen(false);
    setEditItem(null);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await removeOccasional(deleteItem.id);
      addToast('success', 'Receita avulsa excluída com sucesso!');
      setDeleteItem(null);
    } catch (err) {
      addToast('error', (err as Error).message || 'Erro ao excluir receita avulsa.');
    } finally {
      setDeleting(false);
    }
  };

  const getParams = () => {
    const [sortBy, sortOrder] = sortValue ? sortValue.split(':') as [string, string] : [undefined, undefined];
    return { ...period, search: debouncedSearch || undefined, sortBy, sortOrder, page };
  };

  const total = formatBRL(occasionalTotal);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Receitas Avulsas</h1>
        <div className="flex items-center gap-3">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button onClick={openCreate}>+ Novo</Button>
        </div>
      </div>

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
          <option value="date:asc">Mais antigos</option>
          <option value="price:desc">Maior valor</option>
          <option value="price:asc">Menor valor</option>
          <option value="name:asc">A-Z</option>
          <option value="name:desc">Z-A</option>
        </select>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Total</span>
          <span className="text-xl font-bold text-green-600">{total}</span>
        </div>
      </Card>

      {error && <ErrorState message={error} onRetry={() => fetchOccasional(getParams())} />}

      {loading && !error && <TableSkeleton />}

      {!loading && !error && occasional.length === 0 && (
        <EmptyState
          title="Nenhuma receita avulsa"
          description="Clique em '+ Novo' para adicionar sua primeira receita."
          action={{ label: '+ Nova receita', onClick: openCreate }}
        />
      )}

      {!loading && !error && occasional.length > 0 && (
        <>
          <DataTable
            columns={columns}
            data={occasional as unknown as Record<string, unknown>[]}
            onClick={(row) => navigate(`/revenues/occasional/${row.id}`)}
            onEdit={(row) => openEdit(row as unknown as OccasionalRevenue)}
            onDelete={(row) => setDeleteItem(row as unknown as OccasionalRevenue)}
          />
          <Pagination page={page} limit={20} total={occasionalCount} onPageChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} title={editItem ? 'Editar receita avulsa' : 'Nova receita avulsa'}>
        <OccasionalRevenueForm
          initialData={editItem || undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditItem(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir receita avulsa"
        message={`Tem certeza que deseja excluir "${deleteItem?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
