import { OccasionalRevenue } from '../../../domain/entities/OccasionalRevenue.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';
import { IOccasionalRevenueRepository } from '../../ports/repositories/IOccasionalRevenueRepository.js';

export interface UpdateOccasionalRevenueInput {
  id: string;
  name?: string;
  notes?: string | null;
  price?: number;
  date?: Date;
  categoryId?: string | null;
}

export class UpdateOccasionalRevenueUseCase {
  constructor(
    private readonly revenueRepo: IOccasionalRevenueRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: UpdateOccasionalRevenueInput): Promise<OccasionalRevenue> {
    const revenue = await this.revenueRepo.findById(input.id);
    if (!revenue) {
      throw new NotFoundError('OccasionalRevenue', input.id);
    }

    if (input.categoryId !== undefined) {
      if (input.categoryId !== null) {
        const category = await this.categoryRepo.findById(input.categoryId);
        if (!category) {
          throw new NotFoundError('Category', input.categoryId);
        }
      }
      revenue.changeCategory(input.categoryId);
    }

    if (input.name !== undefined) revenue.changeName(input.name);
    if (input.notes !== undefined) revenue.changeNotes(input.notes);
    if (input.price !== undefined) revenue.changePrice(input.price);
    if (input.date !== undefined) revenue.changeDate(input.date);

    return this.revenueRepo.update(revenue);
  }
}
