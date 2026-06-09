import { User } from '../../../domain/entities/User.js';

export interface AccessLogData {
  id: string;
  userId: string;
  action: string;
  page: string | null;
  ip: string | null;
  userAgent: string | null;
  errorMessage: string | null;
  status: string;
  createdAt: Date;
}

export interface AccessLogFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  action?: string;
  page?: number;
  limit?: number;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(search?: string): Promise<User[]>;
  save(user: User): Promise<User>;
  updateUser(id: string, data: { email?: string; passwordHash?: string }): Promise<User>;
  saveAccessLog(userId: string, action: string, page: string | null, ip: string | null, status: string, userAgent?: string | null, errorMessage?: string | null): Promise<void>;
  getAccessLogById(id: string): Promise<AccessLogData | null>;
  getAccessLogsByUser(userId: string, filters?: AccessLogFilters): Promise<{ data: AccessLogData[]; total: number }>;
  getPageAccessStats(): Promise<{ page: string; count: number }[]>;
  getActionStats(): Promise<{ action: string; count: number }[]>;
  getUserCount(): Promise<number>;
}
