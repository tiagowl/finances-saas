import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  type?: 'expense' | 'revenue' | 'neutral';
  onClick?: () => void;
}

const typeStyles = {
  expense: 'text-red-600',
  revenue: 'text-green-600',
  neutral: 'text-primary-700',
};

const typeIcons = {
  expense: TrendingDown,
  revenue: TrendingUp,
  neutral: TrendingUp,
};

export default function StatCard({ title, value, type = 'neutral', onClick }: StatCardProps) {
  const Icon = typeIcons[type];
  return (
    <Card onClick={onClick} className="flex items-center gap-3 md:gap-4">
      <div className={`p-2 md:p-3 rounded-lg ${type === 'expense' ? 'bg-red-50' : type === 'revenue' ? 'bg-green-50' : 'bg-primary-50'}`}>
        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${typeStyles[type]}`} />
      </div>
      <div>
        <p className="text-xs md:text-sm text-slate-500">{title}</p>
        <p className={`text-lg md:text-2xl font-bold ${typeStyles[type]}`}>{value}</p>
      </div>
    </Card>
  );
}
