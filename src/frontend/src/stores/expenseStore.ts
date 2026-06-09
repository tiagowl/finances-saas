import { create } from 'zustand';
import { occasionalExpenseApi, recurringExpenseApi } from '../services/api';
import type { OccasionalExpense, RecurringExpense, PaginationParams } from '../types';

let occasionalFetchSeq = 0;
let recurringFetchSeq = 0;

interface ExpenseState {
  occasional: OccasionalExpense[];
  recurring: RecurringExpense[];
  occasionalTotal: number;
  recurringTotal: number;
  occasionalCount: number;
  recurringCount: number;
  occasionalPage: number;
  recurringPage: number;
  loading: boolean;
  error: string | null;

  fetchOccasional: (params?: PaginationParams) => Promise<void>;
  fetchRecurring: (params?: PaginationParams) => Promise<void>;
  createOccasional: (data: Partial<OccasionalExpense>) => Promise<OccasionalExpense>;
  updateOccasional: (id: string, data: Partial<OccasionalExpense>) => Promise<OccasionalExpense>;
  removeOccasional: (id: string) => Promise<void>;
  createRecurring: (data: Partial<RecurringExpense>) => Promise<RecurringExpense>;
  updateRecurring: (id: string, data: Partial<RecurringExpense>) => Promise<RecurringExpense>;
  removeRecurring: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  occasional: [],
  recurring: [],
  occasionalTotal: 0,
  recurringTotal: 0,
  occasionalCount: 0,
  recurringCount: 0,
  occasionalPage: 1,
  recurringPage: 1,
  loading: false,
  error: null,

  fetchOccasional: async (params) => {
    const seq = ++occasionalFetchSeq;
    set({ loading: true, error: null });
    try {
      const { search, sortBy, sortOrder, page, ...rest } = params || {};
      const apiParams = { ...rest, search, sortBy, sortOrder, page, limit: 20 };
      const [result, { total }] = await Promise.all([
        occasionalExpenseApi.list(apiParams),
        occasionalExpenseApi.total(apiParams),
      ]);
      if (seq !== occasionalFetchSeq) return;
      set({ occasional: result.data, occasionalTotal: total, occasionalCount: result.total, occasionalPage: page || 1, loading: false });
    } catch (err) {
      if (seq !== occasionalFetchSeq) return;
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchRecurring: async (params) => {
    const seq = ++recurringFetchSeq;
    set({ loading: true, error: null });
    try {
      const { page, ...rest } = params || {};
      const apiParams = { ...rest, page, limit: 20 };
      const [result, { total }] = await Promise.all([
        recurringExpenseApi.list(apiParams),
        recurringExpenseApi.total(apiParams),
      ]);
      if (seq !== recurringFetchSeq) return;
      set({ recurring: result.data, recurringTotal: total, recurringCount: result.total, recurringPage: page || 1, loading: false });
    } catch (err) {
      if (seq !== recurringFetchSeq) return;
      set({ error: (err as Error).message, loading: false });
    }
  },

  createOccasional: async (data) => {
    const expense = await occasionalExpenseApi.create(data);
    occasionalFetchSeq++;
    set((s) => ({
      occasional: [expense, ...s.occasional],
      occasionalCount: s.occasionalCount + 1,
      occasionalTotal: s.occasionalTotal + expense.price,
    }));
    return expense;
  },

  updateOccasional: async (id, data) => {
    const expense = await occasionalExpenseApi.update(id, data);
    occasionalFetchSeq++;
    set((s) => ({
      occasional: s.occasional.map((e) => (e.id === id ? expense : e)),
    }));
    return expense;
  },

  removeOccasional: async (id) => {
    occasionalFetchSeq++;
    await occasionalExpenseApi.delete(id);
    set((s) => {
      const item = s.occasional.find((e) => e.id === id);
      return {
        occasional: s.occasional.filter((e) => e.id !== id),
        occasionalCount: Math.max(0, s.occasionalCount - 1),
        occasionalTotal: item ? s.occasionalTotal - item.price : s.occasionalTotal,
      };
    });
  },

  createRecurring: async (data) => {
    const expense = await recurringExpenseApi.create(data);
    recurringFetchSeq++;
    set((s) => ({
      recurring: [expense, ...s.recurring],
      recurringCount: s.recurringCount + 1,
      recurringTotal: s.recurringTotal + expense.price,
    }));
    return expense;
  },

  updateRecurring: async (id, data) => {
    const expense = await recurringExpenseApi.update(id, data);
    recurringFetchSeq++;
    set((s) => ({
      recurring: s.recurring.map((e) => (e.id === id ? expense : e)),
    }));
    return expense;
  },

  removeRecurring: async (id) => {
    recurringFetchSeq++;
    await recurringExpenseApi.delete(id);
    set((s) => {
      const item = s.recurring.find((e) => e.id === id);
      return {
        recurring: s.recurring.filter((e) => e.id !== id),
        recurringCount: Math.max(0, s.recurringCount - 1),
        recurringTotal: item ? s.recurringTotal - item.price : s.recurringTotal,
      };
    });
  },
}));
