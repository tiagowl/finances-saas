import { Category } from '../../../domain/entities/Category.js';
import { ICategoryRepository, CategoryFilters } from '../../../application/ports/repositories/ICategoryRepository.js';
import { prisma } from '../prisma.js';
import { Prisma } from '@prisma/client';

type PrismaCategory = Prisma.CategoryGetPayload<{}>;

export class PrismaCategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const raw = await prisma.category.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findByName(name: string, userId: string): Promise<Category | null> {
    const raw = await prisma.category.findFirst({
      where: { name, userId },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async findAll(filters: CategoryFilters): Promise<{ data: Category[]; total: number }> {
    const where = { userId: filters.userId };

    const [raws, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: filters.page ? (filters.page - 1) * (filters.limit ?? 20) : undefined,
        take: filters.limit ?? (filters.page ? 20 : undefined),
      }),
      prisma.category.count({ where }),
    ]);

    return { data: raws.map(this.toDomain), total };
  }

  async save(category: Category): Promise<Category> {
    const data = category.toJSON();
    const raw = await prisma.category.create({
      data: {
        id: data.id,
        name: data.name,
        notes: data.notes,
        maxBudget: data.maxBudget,
        userId: data.userId,
      },
    });
    return this.toDomain(raw);
  }

  async update(category: Category): Promise<Category> {
    const data = category.toJSON();
    const raw = await prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        notes: data.notes,
        maxBudget: data.maxBudget,
      },
    });
    return this.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.occasionalExpense.deleteMany({ where: { categoryId: id } }),
      prisma.recurringExpense.deleteMany({ where: { categoryId: id } }),
      prisma.occasionalRevenue.updateMany({ where: { categoryId: id }, data: { categoryId: null } }),
      prisma.recurringRevenue.updateMany({ where: { categoryId: id }, data: { categoryId: null } }),
      prisma.category.delete({ where: { id } }),
    ]);
  }

  private toDomain(raw: PrismaCategory): Category {
    return Category.create({
      id: raw.id,
      name: raw.name,
      notes: raw.notes,
      maxBudget: raw.maxBudget?.toNumber() ?? null,
      userId: raw.userId,
    });
  }
}
