interface BudgetBarProps {
  current: number;
  max: number | null;
}

export default function BudgetBar({ current, max }: BudgetBarProps) {
  if (!max || max === 0) {
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Sem orçamento definido</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full" />
      </div>
    );
  }

  const percentage = Math.min((current / max) * 100, 100);
  const colorClass =
    percentage < 70
      ? 'bg-green-500'
      : percentage < 90
        ? 'bg-amber-500'
        : 'bg-red-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500">
          R$ {current.toFixed(2)} / R$ {max.toFixed(2)}
        </span>
        <span className={colorClass.replace('bg-', 'text-')}>
          {percentage.toFixed(0)}% usado
        </span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
