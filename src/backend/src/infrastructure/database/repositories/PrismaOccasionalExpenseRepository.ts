import { OccasionalExpense } from '../../../domain/entities/OccasionalExpense.js';
import { IOccasionalExpenseRepository, OccasionalExpenseFilters, OccasionalExpenseTotalFilters } from '../../../application/ports/repositories/IOccasionalExpenseRepository.js';
import { prisma } from '../prisma.js';
import { Prisma } from '@prisma/client';

type PrismaOccasionalExpense = Prisma.OccasionalExpenseGetPayload<{
  include: { category: true }
}>;

type PrismaOccasionalExpenseFlat = Prisma.OccasionalExpenseGetPayload<{}>;

export class PrismaOccasionalExpenseRepository implements IOccasionalExpenseRepository {
  async findById(id: string): Promise<OccasionalExpense | null> {
    const raw = await prisma.occasionalExpense.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findAll(filters: OccasionalExpenseFilters): Promise<{ data: OccasionalExpense[]; total: number }> {
    const where: Prisma.OccasionalExpenseWhereInput = { userId: filters.userId };

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters?.startDate) where.date.gte = filters.startDate;
      if (filters?.endDate) where.date.lte = filters.endDate;
    }
    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const orderBy: Prisma.OccasionalExpenseOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder ?? 'desc';
    } else {
      orderBy.date = 'desc';
    }

    const [raws, total] = await Promise.all([
      prisma.occasionalExpense.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: filters.page ? (filters.page - 1) * (filters.limit ?? 20) : undefined,
        take: filters.limit ?? (filters.page ? 20 : undefined),
      }),
      prisma.occasionalExpense.count({ where }),
    ]);

    return { data: raws.map(this.toDomain), total };
  }

  async save(expense: OccasionalExpense): Promise<OccasionalExpense> {
    const data = expense.toJSON();
    const raw = await prisma.occasionalExpense.create({
      data: {
        id: data.id,
        name: data.name,
        notes: data.notes,
        price: data.price,
        date: new Date(data.date),
        categoryId: data.categoryId,
        userId: data.userId,
      },
    });
    return this.toDomain(raw);
  }

  async update(expense: OccasionalExpense): Promise<OccasionalExpense> {
    const data = expense.toJSON();
    const raw = await prisma.occasionalExpense.update({
      where: { id: data.id },
      data: {
        name: data.name,
        notes: data.notes,
        price: data.price,
        date: new Date(data.date),
        categoryId: data.categoryId,
      },
    });
    return this.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await prisma.occasionalExpense.delete({ where: { id } });
  }

  async getTotal(filters: OccasionalExpenseTotalFilters): Promise<number> {
    const where: Prisma.OccasionalExpenseWhereInput = { userId: filters.userId };

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters?.startDate) where.date.gte = filters.startDate;
      if (filters?.endDate) where.date.lte = filters.endDate;
    }

    const result = await prisma.occasionalExpense.aggregate({
      where,
      _sum: { price: true },
    });

    return result._sum.price?.toNumber() ?? 0;
  }

  private toDomain(raw: PrismaOccasionalExpense | PrismaOccasionalExpenseFlat): OccasionalExpense {
    return OccasionalExpense.create({
      id: raw.id,
      name: raw.name,
      notes: raw.notes,
      price: (raw.price as unknown as Prisma.Decimal).toNumber(),
      date: raw.date,
      categoryId: raw.categoryId,
      userId: raw.userId,
    });
  }
}
