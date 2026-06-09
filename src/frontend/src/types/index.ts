export interface Category {
  id: string;
  name: string;
  notes: string | null;
  maxBudget: number | null;
}

export interface OccasionalExpense {
  id: string;
  name: string;
  notes: string | null;
  price: number;
  date: string;
  categoryId: string;
}

export interface RecurringExpense {
  id: string;
  name: string;
  notes: string | null;
  price: number;
  installments: number | null;
  categoryId: string;
}

export interface OccasionalRevenue {
  id: string;
  name: string;
  notes: string | null;
  price: number;
  date: string;
  categoryId: string | null;
}

export interface RecurringRevenue {
  id: string;
  name: string;
  notes: string | null;
  price: number;
  installments: number | null;
  categoryId: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AccessLogEntry {
  id: string;
  userId: string;
  action: string;
  page: string | null;
  ip: string | null;
  userAgent: string | null;
  errorMessage: string | null;
  status: string;
  createdAt: string;
}

export interface AccessLogDetail extends AccessLogEntry {
  userName: string;
}

export interface AdminDashboardStats {
  userCount: number;
  mostAccessedPages: { page: string; count: number }[];
  mostUsedActions: { action: string; count: number }[];
}

export interface UserDetailData {
  user: AdminUser;
  accessLogs: AccessLogEntry[];
  totalAccesses: number;
}

export interface DashboardStats {
  totalOccasionalExpenses: number;
  totalRecurringExpenses: number;
  totalOccasionalRevenues: number;
  totalRecurringRevenues: number;
  balance: number;
  lastTransactions: {
    id: string;
    name: string;
    price: number;
    date: string;
    categoryName: string;
    type: 'expense' | 'revenue';
  }[];
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: { field: string; message: string }[];
  timestamp: string;
}

export interface PaginationParams {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}
