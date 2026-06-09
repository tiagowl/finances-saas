import { OccasionalRevenue } from '../../../domain/entities/OccasionalRevenue.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';
import { IOccasionalRevenueRepository } from '../../ports/repositories/IOccasionalRevenueRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';

export interface CreateOccasionalRevenueInput {
  name: string;
  notes?: string | null;
  price: number;
  date: Date;
  categoryId?: string | null;
  userId: string;
}

export class CreateOccasionalRevenueUseCase {
  constructor(
    private readonly revenueRepo: IOccasionalRevenueRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: CreateOccasionalRevenueInput): Promise<OccasionalRevenue> {
    if (input.categoryId) {
      const category = await this.categoryRepo.findById(input.categoryId);
      if (!category) {
        throw new NotFoundError('Category', input.categoryId);
      }
    }

    const revenue = OccasionalRevenue.create({
      name: input.name,
      notes: input.notes,
      price: input.price,
      date: input.date,
      categoryId: input.categoryId,
      userId: input.userId,
    });

    return this.revenueRepo.save(revenue);
  }
}
