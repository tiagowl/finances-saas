import { IOccasionalExpenseRepository } from '../../ports/repositories/IOccasionalExpenseRepository.js';
import { IRecurringExpenseRepository } from '../../ports/repositories/IRecurringExpenseRepository.js';
import { IOccasionalRevenueRepository } from '../../ports/repositories/IOccasionalRevenueRepository.js';
import { IRecurringRevenueRepository } from '../../ports/repositories/IRecurringRevenueRepository.js';

export interface DashboardFilters {
  userId: string;
  startDate?: Date;
  endDate?: Date;
}

export interface DashboardStats {
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

export class GetDashboardStatsUseCase {
  constructor(
    private readonly occasionalExpenseRepo: IOccasionalExpenseRepository,
    private readonly recurringExpenseRepo: IRecurringExpenseRepository,
    private readonly occasionalRevenueRepo: IOccasionalRevenueRepository,
    private readonly recurringRevenueRepo: IRecurringRevenueRepository,
  ) {}

  async execute(filters: DashboardFilters): Promise<DashboardStats> {
    const [occasionalExpensesTotal, recurringExpensesTotal, occasionalRevenuesTotal, recurringRevenuesTotal, lastExpensesResult, lastRevenuesResult] =
      await Promise.all([
        this.occasionalExpenseRepo.getTotal({ userId: filters.userId, startDate: filters.startDate, endDate: filters.endDate }),
        this.recurringExpenseRepo.getTotal({ userId: filters.userId }),
        this.occasionalRevenueRepo.getTotal({ userId: filters.userId, startDate: filters.startDate, endDate: filters.endDate }),
        this.recurringRevenueRepo.getTotal({ userId: filters.userId }),
        this.occasionalExpenseRepo.findAll({ userId: filters.userId, startDate: filters.startDate, endDate: filters.endDate }),
        this.occasionalRevenueRepo.findAll({ userId: filters.userId, startDate: filters.startDate, endDate: filters.endDate }),
      ]);

    const lastExpenses = lastExpensesResult.data;
    const lastRevenues = lastRevenuesResult.data;

    const totalExpenses = occasionalExpensesTotal + recurringExpensesTotal;
    const totalRevenues = occasionalRevenuesTotal + recurringRevenuesTotal;

    const allTransactions = [
      ...lastExpenses.map((e) => ({
        id: e.id,
        name: e.name,
        price: e.price,
        date: e.date,
        categoryName: '',
        type: 'expense' as const,
      })),
      ...lastRevenues.map((r) => ({
        id: r.id,
        name: r.name,
        price: r.price,
        date: r.date,
        categoryName: '',
        type: 'revenue' as const,
      })),
    ];

    const sortedTransactions = allTransactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    return {
      totalOccasionalExpenses: occasionalExpensesTotal,
      totalRecurringExpenses: recurringExpensesTotal,
      totalOccasionalRevenues: occasionalRevenuesTotal,
      totalRecurringRevenues: recurringRevenuesTotal,
      balance: totalRevenues - totalExpenses,
      lastTransactions: sortedTransactions.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        date: t.date.toISOString(),
        categoryName: t.categoryName,
        type: t.type,
      })),
    };
  }
}
