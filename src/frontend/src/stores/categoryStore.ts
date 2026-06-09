import { create } from 'zustand';
import { categoryApi } from '../services/api';
import type { Category, PaginationParams } from '../types';

let categoryFetchSeq = 0;

interface CategoryState {
  categories: Category[];
  categoryCount: number;
  categoryPage: number;
  loading: boolean;
  error: string | null;
  fetch: (params?: PaginationParams) => Promise<void>;
  create: (data: Partial<Category>) => Promise<Category>;
  update: (id: string, data: Partial<Category>) => Promise<Category>;
  remove: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  categoryCount: 0,
  categoryPage: 1,
  loading: false,
  error: null,

  fetch: async (params) => {
    const seq = ++categoryFetchSeq;
    set({ loading: true, error: null });
    try {
      const { page, ...rest } = params || {};
      const result = await categoryApi.list({ ...rest, page, limit: 20 });
      if (seq !== categoryFetchSeq) return;
      set({ categories: result.data, categoryCount: result.total, categoryPage: page || 1, loading: false });
    } catch (err) {
      if (seq !== categoryFetchSeq) return;
      set({ error: (err as Error).message, loading: false });
    }
  },

  create: async (data) => {
    const category = await categoryApi.create(data);
    categoryFetchSeq++;
    set((s) => ({ categories: [...s.categories, category], categoryCount: s.categoryCount + 1 }));
    return category;
  },

  update: async (id, data) => {
    const category = await categoryApi.update(id, data);
    categoryFetchSeq++;
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? category : c)),
    }));
    return category;
  },

  remove: async (id) => {
    categoryFetchSeq++;
    await categoryApi.delete(id);
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
      categoryCount: Math.max(0, s.categoryCount - 1),
    }));
  },
}));
