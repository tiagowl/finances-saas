import { create } from 'zustand';
import { occasionalRevenueApi, recurringRevenueApi } from '../services/api';
import type { OccasionalRevenue, RecurringRevenue, PaginationParams } from '../types';

let occasionalFetchSeq = 0;
let recurringFetchSeq = 0;

interface RevenueState {
  occasional: OccasionalRevenue[];
  recurring: RecurringRevenue[];
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
  createOccasional: (data: Partial<OccasionalRevenue>) => Promise<OccasionalRevenue>;
  updateOccasional: (id: string, data: Partial<OccasionalRevenue>) => Promise<OccasionalRevenue>;
  removeOccasional: (id: string) => Promise<void>;
  createRecurring: (data: Partial<RecurringRevenue>) => Promise<RecurringRevenue>;
  updateRecurring: (id: string, data: Partial<RecurringRevenue>) => Promise<RecurringRevenue>;
  removeRecurring: (id: string) => Promise<void>;
}

export const useRevenueStore = create<RevenueState>((set) => ({
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
        occasionalRevenueApi.list(apiParams),
        occasionalRevenueApi.total(apiParams),
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
        recurringRevenueApi.list(apiParams),
        recurringRevenueApi.total(apiParams),
      ]);
      if (seq !== recurringFetchSeq) return;
      set({ recurring: result.data, recurringTotal: total, recurringCount: result.total, recurringPage: page || 1, loading: false });
    } catch (err) {
      if (seq !== recurringFetchSeq) return;
      set({ error: (err as Error).message, loading: false });
    }
  },

  createOccasional: async (data) => {
    const revenue = await occasionalRevenueApi.create(data);
    occasionalFetchSeq++;
    set((s) => ({
      occasional: [revenue, ...s.occasional],
      occasionalCount: s.occasionalCount + 1,
      occasionalTotal: s.occasionalTotal + revenue.price,
    }));
    return revenue;
  },

  updateOccasional: async (id, data) => {
    const revenue = await occasionalRevenueApi.update(id, data);
    occasionalFetchSeq++;
    set((s) => ({
      occasional: s.occasional.map((r) => (r.id === id ? revenue : r)),
    }));
    return revenue;
  },

  removeOccasional: async (id) => {
    occasionalFetchSeq++;
    await occasionalRevenueApi.delete(id);
    set((s) => {
      const item = s.occasional.find((r) => r.id === id);
      return {
        occasional: s.occasional.filter((r) => r.id !== id),
        occasionalCount: Math.max(0, s.occasionalCount - 1),
        occasionalTotal: item ? s.occasionalTotal - item.price : s.occasionalTotal,
      };
    });
  },

  createRecurring: async (data) => {
    const revenue = await recurringRevenueApi.create(data);
    recurringFetchSeq++;
    set((s) => ({
      recurring: [revenue, ...s.recurring],
      recurringCount: s.recurringCount + 1,
      recurringTotal: s.recurringTotal + revenue.price,
    }));
    return revenue;
  },

  updateRecurring: async (id, data) => {
    const revenue = await recurringRevenueApi.update(id, data);
    recurringFetchSeq++;
    set((s) => ({
      recurring: s.recurring.map((r) => (r.id === id ? revenue : r)),
    }));
    return revenue;
  },

  removeRecurring: async (id) => {
    recurringFetchSeq++;
    await recurringRevenueApi.delete(id);
    set((s) => {
      const item = s.recurring.find((r) => r.id === id);
      return {
        recurring: s.recurring.filter((r) => r.id !== id),
        recurringCount: Math.max(0, s.recurringCount - 1),
        recurringTotal: item ? s.recurringTotal - item.price : s.recurringTotal,
      };
    });
  },
}));
