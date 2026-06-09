import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryStore } from '../stores/categoryStore';
import { useToastStore } from '../hooks/useToast';
import { occasionalExpenseApi, recurringExpenseApi } from '../services/api';
import DataTable from '../components/shared/DataTable';
import BudgetBar from '../components/shared/BudgetBar';
import Pagination from '../components/shared/Pagination';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { TableSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import CategoryForm from '../components/forms/CategoryForm';
import type { Category, OccasionalExpense, RecurringExpense } from '../types';

export default function Categories() {
  const navigate = useNavigate();
  const { categories, categoryCount, categoryPage, loading, error, fetch, create, update, remove } = useCategoryStore();
  const addToast = useToastStore((s) => s.add);
  const [spentByCategory, setSpentByCategory] = useState<Record<string, number>>({});
  const [fetchingSpent, setFetchingSpent] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteItem, setDeleteItem] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch({ page });
  }, [page]);

  useEffect(() => {
    if (categories.length === 0) return;
    setFetchingSpent(true);
    Promise.all([
      occasionalExpenseApi.list(),
      recurringExpenseApi.list(),
    ]).then(([occExp, recExp]) => {
      const map: Record<string, number> = {};
      for (const e of occExp.data) {
        map[e.categoryId] = (map[e.categoryId] || 0) + e.price;
      }
      for (const e of recExp.data) {
        map[e.categoryId] = (map[e.categoryId] || 0) + e.price;
      }
      setSpentByCategory(map);
    }).finally(() => setFetchingSpent(false));
  }, [categories]);

  const columns = [
    { key: 'name', label: 'Nome' },
    {
      key: 'maxBudget',
      label: 'Orçamento',
      render: (_v: unknown, row: Record<string, unknown>) => {
        const max = row.maxBudget ? Number(row.maxBudget) : null;
        const current = spentByCategory[row.id as string] || 0;
        return <BudgetBar current={current} max={max} />;
      },
    },
  ];

  const openCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: Category) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSubmit = async (data: { name: string; notes?: string; maxBudget?: number }) => {
    if (editItem) {
      await update(editItem.id, data);
      addToast('success', 'Categoria atualizada com sucesso!');
    } else {
      await create(data);
      addToast('success', 'Categoria criada com sucesso!');
    }
    setModalOpen(false);
    setEditItem(null);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await remove(deleteItem.id);
      addToast('success', 'Categoria excluída com sucesso!');
      setDeleteItem(null);
    } catch (err) {
      addToast('error', (err as Error).message || 'Erro ao excluir categoria.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Categorias</h1>
        <Button onClick={openCreate}>+ Novo</Button>
      </div>

      {error && <ErrorState message={error} onRetry={() => fetch({ page })} />}

      {loading && !error && <TableSkeleton />}

      {!loading && !error && categories.length === 0 && (
        <EmptyState
          title="Nenhuma categoria"
          description="Clique em '+ Novo' para criar sua primeira categoria."
          action={{ label: '+ Nova categoria', onClick: openCreate }}
        />
      )}

      {!loading && !error && categories.length > 0 && (
        <>
          <DataTable
            columns={columns}
            data={categories as unknown as Record<string, unknown>[]}
            onClick={(row) => navigate(`/categories/${row.id}`)}
            onEdit={(row) => openEdit(row as unknown as Category)}
            onDelete={(row) => setDeleteItem(row as unknown as Category)}
          />
          <Pagination page={page} limit={20} total={categoryCount} onPageChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} title={editItem ? 'Editar categoria' : 'Nova categoria'}>
        <CategoryForm
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
        title="Excluir categoria"
        message={`Tem certeza que deseja excluir "${deleteItem?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
