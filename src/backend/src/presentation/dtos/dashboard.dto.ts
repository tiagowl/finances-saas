import { DashboardStats } from '../../application/use-cases/dashboard/GetDashboardStatsUseCase.js';

export interface DashboardStatsResponse {
  totalOccasionalExpenses: number;
  totalRecurringExpenses: number;
  totalOccasionalRevenues: number;
  totalRecurringRevenues: number;
  balance: number;
  lastTransactions: {
    id: string;
    name: string;
    price: number;
    date: string;
    categoryName: string;
    type: 'expense' | 'revenue';
  }[];
}

export function dashboardStatsToResponse(stats: DashboardStats): DashboardStatsResponse {
  return {
    totalOccasionalExpenses: stats.totalOccasionalExpenses,
    totalRecurringExpenses: stats.totalRecurringExpenses,
    totalOccasionalRevenues: stats.totalOccasionalRevenues,
    totalRecurringRevenues: stats.totalRecurringRevenues,
    balance: stats.balance,
    lastTransactions: stats.lastTransactions,
  };
}
