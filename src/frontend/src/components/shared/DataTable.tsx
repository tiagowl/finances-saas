import { Pencil, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (row: Record<string, unknown>) => void;
  onClick?: (row: Record<string, unknown>) => void;
  actions?: boolean;
}

export default function DataTable({ columns, data, onEdit, onDelete, onClick, actions = true }: DataTableProps) {
  if (data.length === 0) return null;

  return (
    <div className="space-y-2">
      {data.map((row, idx) => (
        <div
          key={row.id as string || idx}
          onClick={onClick ? () => onClick(row) : undefined}
          className={`bg-white rounded-lg border border-slate-200 p-4 ${onClick ? 'cursor-pointer hover:border-primary-300 hover:shadow-sm' : ''} card-hover`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              {columns.map((col) => (
                <div key={col.key}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : <span className="text-sm text-slate-900">{String(row[col.key] ?? '')}</span>
                  }
                </div>
              ))}
            </div>
            {actions && (onEdit || onDelete) && (
              <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                {onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                    aria-label="Editar"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Excluir"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
