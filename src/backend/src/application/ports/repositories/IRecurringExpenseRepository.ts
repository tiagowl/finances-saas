import { RecurringExpense } from '../../../domain/entities/RecurringExpense.js';

export interface RecurringExpenseFilters {
  userId: string;
  categoryId?: string;
  search?: string;
  sortBy?: 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RecurringExpenseTotalFilters {
  userId: string;
  categoryId?: string;
}

export interface IRecurringExpenseRepository {
  findById(id: string): Promise<RecurringExpense | null>;
  findAll(filters: RecurringExpenseFilters): Promise<{ data: RecurringExpense[]; total: number }>;
  save(expense: RecurringExpense): Promise<RecurringExpense>;
  update(expense: RecurringExpense): Promise<RecurringExpense>;
  delete(id: string): Promise<void>;
  getTotal(filters: RecurringExpenseTotalFilters): Promise<number>;
}
