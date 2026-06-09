import { RecurringRevenue } from '../../../domain/entities/RecurringRevenue.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';
import { IRecurringRevenueRepository } from '../../ports/repositories/IRecurringRevenueRepository.js';

export interface UpdateRecurringRevenueInput {
  id: string;
  name?: string;
  notes?: string | null;
  price?: number;
  installments?: number | null;
  categoryId?: string | null;
}

export class UpdateRecurringRevenueUseCase {
  constructor(
    private readonly revenueRepo: IRecurringRevenueRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: UpdateRecurringRevenueInput): Promise<RecurringRevenue> {
    const revenue = await this.revenueRepo.findById(input.id);
    if (!revenue) {
      throw new NotFoundError('RecurringRevenue', input.id);
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
    if (input.installments !== undefined) revenue.changeInstallments(input.installments);

    return this.revenueRepo.update(revenue);
  }
}
