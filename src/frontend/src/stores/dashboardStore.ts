import { create } from 'zustand';
import { dashboardApi } from '../services/api';
import type { DashboardStats, PaginationParams } from '../types';

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetch: (params?: PaginationParams) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: false,
  error: null,

  fetch: async (params) => {
    set({ loading: true, error: null });
    try {
      const stats = await dashboardApi.getStats(params);
      set({ stats, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
