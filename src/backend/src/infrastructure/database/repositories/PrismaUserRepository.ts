import { User } from '../../../domain/entities/User.js';
import { IUserRepository, AccessLogData, AccessLogFilters } from '../../../application/ports/repositories/IUserRepository.js';
import { prisma } from '../prisma.js';
import { Prisma } from '@prisma/client';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    return raw ? this.toDomain(raw) : null;
  }

  async findById(id: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findAll(search?: string): Promise<User[]> {
    const where: Prisma.UserFindManyArgs['where'] = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const raws = await prisma.user.findMany({ where, orderBy: { createdAt: 'desc' } });
    return raws.map((r) => this.toDomain(r));
  }

  async save(user: User): Promise<User> {
    const data = user.toJSON();
    const raw = await prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        passwordHash: user.passwordHash,
        role: data.role,
      },
    });
    return this.toDomain(raw);
  }

  async updateUser(id: string, data: { email?: string; passwordHash?: string }): Promise<User> {
    const raw = await prisma.user.update({
      where: { id },
      data,
    });
    return this.toDomain(raw);
  }

  async saveAccessLog(userId: string, action: string, page: string | null, ip: string | null, status: string, userAgent?: string | null, errorMessage?: string | null): Promise<void> {
    await prisma.accessLog.create({
      data: { userId, action, page, ip, status, userAgent: userAgent ?? null, errorMessage: errorMessage ?? null },
    });
  }

  async getAccessLogById(id: string): Promise<AccessLogData | null> {
    const l = await prisma.accessLog.findUnique({ where: { id } });
    if (!l) return null;
    return this.mapAccessLog(l);
  }

  async getAccessLogsByUser(userId: string, filters?: AccessLogFilters): Promise<{ data: AccessLogData[]; total: number }> {
    const where: Prisma.AccessLogWhereInput = { userId };

    if (filters) {
      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
        if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
      }
      if (filters.status) where.status = filters.status;
      if (filters.action) where.action = filters.action;
    }

    const [logs, total] = await Promise.all([
      prisma.accessLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: filters?.page ? (filters.page - 1) * (filters.limit ?? 20) : undefined,
        take: filters?.limit ?? (filters?.page ? 20 : undefined),
      }),
      prisma.accessLog.count({ where }),
    ]);

    return { data: logs.map((l) => this.mapAccessLog(l)), total };
  }

  async getPageAccessStats(): Promise<{ page: string; count: number }[]> {
    const result = await prisma.accessLog.groupBy({
      by: ['page'],
      where: { page: { not: null } },
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 10,
    });
    return result
      .filter((r) => r.page !== null)
      .map((r) => ({ page: r.page!, count: r._count.page }));
  }

  async getActionStats(): Promise<{ action: string; count: number }[]> {
    const result = await prisma.accessLog.groupBy({
      by: ['action'],
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } },
      take: 10,
    });
    return result.map((r) => ({ action: r.action, count: r._count.action }));
  }

  async getUserCount(): Promise<number> {
    return prisma.user.count();
  }

  private mapAccessLog(l: {
    id: string; userId: string; action: string; page: string | null;
    ip: string | null; userAgent: string | null; errorMessage: string | null;
    status: string; createdAt: Date;
  }): AccessLogData {
    return {
      id: l.id,
      userId: l.userId,
      action: l.action,
      page: l.page,
      ip: l.ip,
      userAgent: l.userAgent,
      errorMessage: l.errorMessage,
      status: l.status,
      createdAt: l.createdAt,
    };
  }

  private toDomain(raw: { id: string; name: string; email: string; passwordHash: string; role: string }): User {
    return User.create({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      passwordHash: raw.passwordHash,
      role: raw.role,
    });
  }
}
