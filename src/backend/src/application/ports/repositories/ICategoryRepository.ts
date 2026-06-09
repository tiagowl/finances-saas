import { Category } from '../../../domain/entities/Category.js';

export interface CategoryFilters {
  userId: string;
  page?: number;
  limit?: number;
}

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string, userId: string): Promise<Category | null>;
  findAll(filters: CategoryFilters): Promise<{ data: Category[]; total: number }>;
  save(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}
