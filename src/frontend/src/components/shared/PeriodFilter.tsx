import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import Button from '../ui/Button';

interface PeriodFilterProps {
  value: { startDate?: string; endDate?: string };
  onChange: (value: { startDate?: string; endDate?: string }) => void;
}

const periods = [
  { label: 'Este mês', getValue: () => ({ startDate: startOfMonth(new Date()).toISOString(), endDate: endOfMonth(new Date()).toISOString() }) },
  { label: 'Mês passado', getValue: () => ({ startDate: startOfMonth(subMonths(new Date(), 1)).toISOString(), endDate: endOfMonth(subMonths(new Date(), 1)).toISOString() }) },
  { label: 'Últimos 3 meses', getValue: () => ({ startDate: startOfMonth(subMonths(new Date(), 2)).toISOString(), endDate: endOfMonth(new Date()).toISOString() }) },
];

export default function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const [open, setOpen] = useState(false);

  const activeLabel = value.startDate
    ? `${format(new Date(value.startDate), 'MMM/yyyy')} - ${format(new Date(value.endDate || value.startDate), 'MMM/yyyy')}`
    : 'Filtrar período';

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(!open)}
        aria-label="Filtrar por período"
      >
        <Calendar className="w-4 h-4" />
        {activeLabel}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-slate-200 shadow-lg z-20 p-2 space-y-1">
            {periods.map((p) => (
              <button
                key={p.label}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-100 transition-colors"
                onClick={() => {
                  onChange(p.getValue());
                  setOpen(false);
                }}
              >
                {p.label}
              </button>
            ))}
            <hr className="my-1 border-slate-200" />
            <button
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-100 text-slate-500"
              onClick={() => {
                onChange({});
                setOpen(false);
              }}
            >
              Limpar filtro
            </button>
          </div>
        </>
      )}
    </div>
  );
}
