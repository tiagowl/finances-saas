import { RecurringExpense } from '../../../domain/entities/RecurringExpense.js';
import { IRecurringExpenseRepository, RecurringExpenseFilters, RecurringExpenseTotalFilters } from '../../../application/ports/repositories/IRecurringExpenseRepository.js';
import { prisma } from '../prisma.js';
import { Prisma } from '@prisma/client';

type PrismaRecurringExpense = Prisma.RecurringExpenseGetPayload<{}>;

export class PrismaRecurringExpenseRepository implements IRecurringExpenseRepository {
  async findById(id: string): Promise<RecurringExpense | null> {
    const raw = await prisma.recurringExpense.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findAll(filters: RecurringExpenseFilters): Promise<{ data: RecurringExpense[]; total: number }> {
    const where: Prisma.RecurringExpenseWhereInput = { userId: filters.userId };
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const orderBy: Prisma.RecurringExpenseOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder ?? 'asc';
    } else {
      orderBy.name = 'asc';
    }

    const [raws, total] = await Promise.all([
      prisma.recurringExpense.findMany({
        where,
        orderBy,
        skip: filters.page ? (filters.page - 1) * (filters.limit ?? 20) : undefined,
        take: filters.limit ?? (filters.page ? 20 : undefined),
      }),
      prisma.recurringExpense.count({ where }),
    ]);

    return { data: raws.map(this.toDomain), total };
  }

  async save(expense: RecurringExpense): Promise<RecurringExpense> {
    const data = expense.toJSON();
    const raw = await prisma.recurringExpense.create({
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

  async update(expense: RecurringExpense): Promise<RecurringExpense> {
    const data = expense.toJSON();
    const raw = await prisma.recurringExpense.update({
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
    await prisma.recurringExpense.delete({ where: { id } });
  }

  async getTotal(filters: RecurringExpenseTotalFilters): Promise<number> {
    const where: Prisma.RecurringExpenseWhereInput = { userId: filters.userId };
    if (filters?.categoryId) where.categoryId = filters.categoryId;

    const result = await prisma.recurringExpense.aggregate({
      where,
      _sum: { price: true },
    });

    return result._sum.price?.toNumber() ?? 0;
  }

  private toDomain(raw: PrismaRecurringExpense): RecurringExpense {
    return RecurringExpense.create({
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
