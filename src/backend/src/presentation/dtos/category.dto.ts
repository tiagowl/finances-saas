import { Category } from '../../domain/entities/Category.js';

export interface CategoryResponse {
  id: string;
  name: string;
  notes: string | null;
  maxBudget: number | null;
}

export function categoryToResponse(category: Category): CategoryResponse {
  const json = category.toJSON();
  const { userId: _, ...response } = json;
  return response;
}

export function categoriesToResponse(categories: Category[]): CategoryResponse[] {
  return categories.map(categoryToResponse);
}
