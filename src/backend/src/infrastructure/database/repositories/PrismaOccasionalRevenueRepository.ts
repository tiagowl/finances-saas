import { OccasionalRevenue } from '../../../domain/entities/OccasionalRevenue.js';
import { IOccasionalRevenueRepository, OccasionalRevenueFilters, OccasionalRevenueTotalFilters } from '../../../application/ports/repositories/IOccasionalRevenueRepository.js';
import { prisma } from '../prisma.js';
import { Prisma } from '@prisma/client';

type PrismaOccasionalRevenue = Prisma.OccasionalRevenueGetPayload<{}>;

export class PrismaOccasionalRevenueRepository implements IOccasionalRevenueRepository {
  async findById(id: string): Promise<OccasionalRevenue | null> {
    const raw = await prisma.occasionalRevenue.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findAll(filters: OccasionalRevenueFilters): Promise<{ data: OccasionalRevenue[]; total: number }> {
    const where: Prisma.OccasionalRevenueWhereInput = { userId: filters.userId };

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters?.startDate) where.date.gte = filters.startDate;
      if (filters?.endDate) where.date.lte = filters.endDate;
    }
    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const orderBy: Prisma.OccasionalRevenueOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder ?? 'desc';
    } else {
      orderBy.date = 'desc';
    }

    const [raws, total] = await Promise.all([
      prisma.occasionalRevenue.findMany({
        where,
        orderBy,
        skip: filters.page ? (filters.page - 1) * (filters.limit ?? 20) : undefined,
        take: filters.limit ?? (filters.page ? 20 : undefined),
      }),
      prisma.occasionalRevenue.count({ where }),
    ]);

    return { data: raws.map(this.toDomain), total };
  }

  async save(revenue: OccasionalRevenue): Promise<OccasionalRevenue> {
    const data = revenue.toJSON();
    const raw = await prisma.occasionalRevenue.create({
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

  async update(revenue: OccasionalRevenue): Promise<OccasionalRevenue> {
    const data = revenue.toJSON();
    const raw = await prisma.occasionalRevenue.update({
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
    await prisma.occasionalRevenue.delete({ where: { id } });
  }

  async getTotal(filters: OccasionalRevenueTotalFilters): Promise<number> {
    const where: Prisma.OccasionalRevenueWhereInput = { userId: filters.userId };

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters?.startDate) where.date.gte = filters.startDate;
      if (filters?.endDate) where.date.lte = filters.endDate;
    }

    const result = await prisma.occasionalRevenue.aggregate({
      where,
      _sum: { price: true },
    });

    return result._sum.price?.toNumber() ?? 0;
  }

  private toDomain(raw: PrismaOccasionalRevenue): OccasionalRevenue {
    return OccasionalRevenue.create({
      id: raw.id,
      name: raw.name,
      notes: raw.notes,
      price: raw.price.toNumber(),
      date: raw.date,
      categoryId: raw.categoryId,
      userId: raw.userId,
    });
  }
}
