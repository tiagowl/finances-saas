import { RecurringRevenue } from '../../../domain/entities/RecurringRevenue.js';
import { IRecurringRevenueRepository, RecurringRevenueFilters, RecurringRevenueTotalFilters } from '../../../application/ports/repositories/IRecurringRevenueRepository.js';
import { prisma } from '../prisma.js';
import { Prisma } from '@prisma/client';

type PrismaRecurringRevenue = Prisma.RecurringRevenueGetPayload<{}>;

export class PrismaRecurringRevenueRepository implements IRecurringRevenueRepository {
  async findById(id: string): Promise<RecurringRevenue | null> {
    const raw = await prisma.recurringRevenue.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findAll(filters: RecurringRevenueFilters): Promise<{ data: RecurringRevenue[]; total: number }> {
    const where: Prisma.RecurringRevenueWhereInput = { userId: filters.userId };
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const orderBy: Prisma.RecurringRevenueOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder ?? 'asc';
    } else {
      orderBy.name = 'asc';
    }

    const [raws, total] = await Promise.all([
      prisma.recurringRevenue.findMany({
        where,
        orderBy,
        skip: filters.page ? (filters.page - 1) * (filters.limit ?? 20) : undefined,
        take: filters.limit ?? (filters.page ? 20 : undefined),
      }),
      prisma.recurringRevenue.count({ where }),
    ]);

    return { data: raws.map(this.toDomain), total };
  }

  async save(revenue: RecurringRevenue): Promise<RecurringRevenue> {
    const data = revenue.toJSON();
    const raw = await prisma.recurringRevenue.create({
      data: {
        id: data.id,
        name: data.name,
        notes: data.notes,
        price: data.price,
        installments: data.installments,
        categoryId: data.categoryId,
        userId: data.userId,
      },
    });
    return this.toDomain(raw);
  }

  async update(revenue: RecurringRevenue): Promise<RecurringRevenue> {
    const data = revenue.toJSON();
    const raw = await prisma.recurringRevenue.update({
      where: { id: data.id },
      data: {
        name: data.name,
        notes: data.notes,
        price: data.price,
        installments: data.installments,
        categoryId: data.categoryId,
      },
    });
    return this.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await prisma.recurringRevenue.delete({ where: { id } });
  }

  async getTotal(filters: RecurringRevenueTotalFilters): Promise<number> {
    const where: Prisma.RecurringRevenueWhereInput = { userId: filters.userId };
    if (filters?.categoryId) where.categoryId = filters.categoryId;

    const result = await prisma.recurringRevenue.aggregate({
      where,
      _sum: { price: true },
    });

    return result._sum.price?.toNumber() ?? 0;
  }

  private toDomain(raw: PrismaRecurringRevenue): RecurringRevenue {
    return RecurringRevenue.create({
      id: raw.id,
      name: raw.name,
      notes: raw.notes,
      price: raw.price.toNumber(),
      installments: raw.installments,
      categoryId: raw.categoryId,
      userId: raw.userId,
    });
  }
}
