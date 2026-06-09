import { OccasionalRevenue } from '../../../domain/entities/OccasionalRevenue.js';

export interface OccasionalRevenueFilters {
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

export interface OccasionalRevenueTotalFilters {
  userId: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IOccasionalRevenueRepository {
  findById(id: string): Promise<OccasionalRevenue | null>;
  findAll(filters: OccasionalRevenueFilters): Promise<{ data: OccasionalRevenue[]; total: number }>;
  save(revenue: OccasionalRevenue): Promise<OccasionalRevenue>;
  update(revenue: OccasionalRevenue): Promise<OccasionalRevenue>;
  delete(id: string): Promise<void>;
  getTotal(filters: OccasionalRevenueTotalFilters): Promise<number>;
}
