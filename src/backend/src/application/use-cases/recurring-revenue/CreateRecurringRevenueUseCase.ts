import { RecurringRevenue } from '../../../domain/entities/RecurringRevenue.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';
import { IRecurringRevenueRepository } from '../../ports/repositories/IRecurringRevenueRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';

export interface CreateRecurringRevenueInput {
  name: string;
  notes?: string | null;
  price: number;
  installments?: number | null;
  categoryId?: string | null;
  userId: string;
}

export class CreateRecurringRevenueUseCase {
  constructor(
    private readonly revenueRepo: IRecurringRevenueRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: CreateRecurringRevenueInput): Promise<RecurringRevenue> {
    if (input.categoryId) {
      const category = await this.categoryRepo.findById(input.categoryId);
      if (!category) {
        throw new NotFoundError('Category', input.categoryId);
      }
    }

    const revenue = RecurringRevenue.create({
      name: input.name,
      notes: input.notes,
      price: input.price,
      installments: input.installments,
      categoryId: input.categoryId,
      userId: input.userId,
    });

    return this.revenueRepo.save(revenue);
  }
}
