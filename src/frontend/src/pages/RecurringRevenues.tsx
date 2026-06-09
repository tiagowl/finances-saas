import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRevenueStore } from '../stores/revenueStore';
import { useToastStore } from '../hooks/useToast';
import { Search } from 'lucide-react';
import DataTable from '../components/shared/DataTable';
import Pagination from '../components/shared/Pagination';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { TableSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import RecurringRevenueForm from '../components/forms/RecurringRevenueForm';
import type { RecurringRevenue } from '../types';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function RecurringRevenues() {
  const navigate = useNavigate();
  const { recurring, recurringTotal, recurringCount, recurringPage, loading, error, fetchRecurring, createRecurring, updateRecurring, removeRecurring } = useRevenueStore();
  const addToast = useToastStore((s) => s.add);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<RecurringRevenue | null>(null);
  const [deleteItem, setDeleteItem] = useState<RecurringRevenue | null>(null);
  const [deleting, setDeleting] = useState(false);
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
  }, [sortValue]);

  useEffect(() => {
    const [sortBy, sortOrder] = sortValue ? sortValue.split(':') as [string, string] : [undefined, undefined];
    fetchRecurring({ search: debouncedSearch || undefined, sortBy, sortOrder, page });
  }, [page, debouncedSearch, sortValue]);

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'price', label: 'Valor', render: (v: unknown) => <span className="font-medium">{formatBRL(v as number)}</span> },
    { key: 'installments', label: 'Parcelas', render: (v: unknown) => (v == null ? <span className="text-slate-400">Indefinido</span> : String(v)) },
  ];

  const openCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: RecurringRevenue) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSubmit = async (data: Parameters<typeof createRecurring>[0]) => {
    if (editItem) {
      await updateRecurring(editItem.id, data);
      addToast('success', 'Receita recorrente atualizada com sucesso!');
    } else {
      await createRecurring(data);
      addToast('success', 'Receita recorrente criada com sucesso!');
    }
    setModalOpen(false);
    setEditItem(null);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await removeRecurring(deleteItem.id);
      addToast('success', 'Receita recorrente excluída com sucesso!');
      setDeleteItem(null);
    } catch (err) {
      addToast('error', (err as Error).message || 'Erro ao excluir receita recorrente.');
    } finally {
      setDeleting(false);
    }
  };

  const total = formatBRL(recurringTotal);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Receitas Recorrentes</h1>
        <Button onClick={openCreate}>+ Novo</Button>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Total mensal</span>
          <span className="text-xl font-bold text-green-600">{total}</span>
        </div>
      </Card>

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
          <option value="">A-Z</option>
          <option value="price:desc">Maior valor</option>
          <option value="price:asc">Menor valor</option>
          <option value="name:desc">Z-A</option>
        </select>
      </div>

      {error && <ErrorState message={error} onRetry={() => fetchRecurring({ search: debouncedSearch || undefined, page })} />}

      {loading && !error && <TableSkeleton />}

      {!loading && !error && recurring.length === 0 && (
        <EmptyState
          title="Nenhuma receita recorrente"
          description="Clique em '+ Novo' para adicionar sua primeira receita recorrente."
          action={{ label: '+ Nova receita', onClick: openCreate }}
        />
      )}

      {!loading && !error && recurring.length > 0 && (
        <>
          <DataTable
            columns={columns}
            data={recurring as unknown as Record<string, unknown>[]}
            onClick={(row) => navigate(`/revenues/recurring/${row.id}`)}
            onEdit={(row) => openEdit(row as unknown as RecurringRevenue)}
            onDelete={(row) => setDeleteItem(row as unknown as RecurringRevenue)}
          />
          <Pagination page={page} limit={20} total={recurringCount} onPageChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} title={editItem ? 'Editar receita recorrente' : 'Nova receita recorrente'}>
        <RecurringRevenueForm
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
        title="Excluir receita recorrente"
        message={`Tem certeza que deseja excluir "${deleteItem?.name}"? Esta ação não pode ser feita.`}
      />
    </div>
  );
}
