import type { Category, OccasionalExpense, RecurringExpense, OccasionalRevenue, RecurringRevenue, DashboardStats, PaginationParams, PaginatedResponse, AdminDashboardStats, AdminUser, UserDetailData, AccessLogDetail } from '../types';
import { apiFetch } from './httpClient';

function getToken(): string | null {
  return localStorage.getItem('finances_token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  return apiFetch<T>(path, { ...options, token: getToken() });
}

// Categories
export const categoryApi = {
  list: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<PaginatedResponse<Category>>(`/api/categories${query}`);
  },
  getById: (id: string) => request<Category>(`/api/categories/${id}`),
  create: (data: Partial<Category>) =>
    request<Category>('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Category>) =>
    request<Category>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/categories/${id}`, { method: 'DELETE' }),
};

// Occasional Expenses
export const occasionalExpenseApi = {
  list: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<PaginatedResponse<OccasionalExpense>>(`/api/expenses/occasional${query}`);
  },
  getById: (id: string) => request<OccasionalExpense>(`/api/expenses/occasional/${id}`),
  create: (data: Partial<OccasionalExpense>) =>
    request<OccasionalExpense>('/api/expenses/occasional', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<OccasionalExpense>) =>
    request<OccasionalExpense>(`/api/expenses/occasional/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/expenses/occasional/${id}`, { method: 'DELETE' }),
  total: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<{ total: number }>(`/api/expenses/occasional/total${query}`);
  },
};

// Recurring Expenses
export const recurringExpenseApi = {
  list: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<PaginatedResponse<RecurringExpense>>(`/api/expenses/recurring${query}`);
  },
  getById: (id: string) => request<RecurringExpense>(`/api/expenses/recurring/${id}`),
  create: (data: Partial<RecurringExpense>) =>
    request<RecurringExpense>('/api/expenses/recurring', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<RecurringExpense>) =>
    request<RecurringExpense>(`/api/expenses/recurring/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/expenses/recurring/${id}`, { method: 'DELETE' }),
  total: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<{ total: number }>(`/api/expenses/recurring/total${query}`);
  },
};

// Occasional Revenues
export const occasionalRevenueApi = {
  list: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<PaginatedResponse<OccasionalRevenue>>(`/api/revenues/occasional${query}`);
  },
  getById: (id: string) => request<OccasionalRevenue>(`/api/revenues/occasional/${id}`),
  create: (data: Partial<OccasionalRevenue>) =>
    request<OccasionalRevenue>('/api/revenues/occasional', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<OccasionalRevenue>) =>
    request<OccasionalRevenue>(`/api/revenues/occasional/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/revenues/occasional/${id}`, { method: 'DELETE' }),
  total: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<{ total: number }>(`/api/revenues/occasional/total${query}`);
  },
};

// Recurring Revenues
export const recurringRevenueApi = {
  list: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<PaginatedResponse<RecurringRevenue>>(`/api/revenues/recurring${query}`);
  },
  getById: (id: string) => request<RecurringRevenue>(`/api/revenues/recurring/${id}`),
  create: (data: Partial<RecurringRevenue>) =>
    request<RecurringRevenue>('/api/revenues/recurring', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<RecurringRevenue>) =>
    request<RecurringRevenue>(`/api/revenues/recurring/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/revenues/recurring/${id}`, { method: 'DELETE' }),
  total: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<{ total: number }>(`/api/revenues/recurring/total${query}`);
  },
};

// Dashboard
export const dashboardApi = {
  getStats: (params?: PaginationParams) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString() : '';
    return request<DashboardStats>(`/api/dashboard${query}`);
  },
};

// Auth / Profile
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ user: { id: string; name: string; email: string; role: string }; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    apiFetch<{ user: { id: string; name: string; email: string; role: string }; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  updateProfile: (data: { email?: string; currentPassword?: string; newPassword?: string }) =>
    request<{ user: { id: string; name: string; email: string; role: string }; token: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Admin
export const adminApi = {
  getDashboardStats: () => request<AdminDashboardStats>('/api/admin/dashboard'),
  listUsers: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<AdminUser[]>(`/api/admin/users${query}`);
  },
  getUser: (id: string, filters?: { startDate?: string; endDate?: string; status?: string; action?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.set('startDate', filters.startDate);
    if (filters?.endDate) params.set('endDate', filters.endDate);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.action) params.set('action', filters.action);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<UserDetailData>(`/api/admin/users/${id}${query}`);
  },
  getAccessLog: (id: string) => request<AccessLogDetail>(`/api/admin/access-logs/${id}`),
};
