import { RecurringRevenue } from '../../../domain/entities/RecurringRevenue.js';

export interface RecurringRevenueFilters {
  userId: string;
  categoryId?: string;
  search?: string;
  sortBy?: 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RecurringRevenueTotalFilters {
  userId: string;
  categoryId?: string;
}

export interface IRecurringRevenueRepository {
  findById(id: string): Promise<RecurringRevenue | null>;
  findAll(filters: RecurringRevenueFilters): Promise<{ data: RecurringRevenue[]; total: number }>;
  save(revenue: RecurringRevenue): Promise<RecurringRevenue>;
  update(revenue: RecurringRevenue): Promise<RecurringRevenue>;
  delete(id: string): Promise<void>;
  getTotal(filters: RecurringRevenueTotalFilters): Promise<number>;
}
