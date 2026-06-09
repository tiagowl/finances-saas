import { OccasionalExpense } from '../../../domain/entities/OccasionalExpense.js';

export interface OccasionalExpenseFilters {
  userId: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  sortBy?: 'name' | 'price' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OccasionalExpenseTotalFilters {
  userId: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IOccasionalExpenseRepository {
  findById(id: string): Promise<OccasionalExpense | null>;
  findAll(filters: OccasionalExpenseFilters): Promise<{ data: OccasionalExpense[]; total: number }>;
  save(expense: OccasionalExpense): Promise<OccasionalExpense>;
  update(expense: OccasionalExpense): Promise<OccasionalExpense>;
  delete(id: string): Promise<void>;
  getTotal(filters: OccasionalExpenseTotalFilters): Promise<number>;
}
