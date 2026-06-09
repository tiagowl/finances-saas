import { RecurringRevenue } from '../../../domain/entities/RecurringRevenue.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IRecurringRevenueRepository } from '../../ports/repositories/IRecurringRevenueRepository.js';

export class GetRecurringRevenueUseCase {
  constructor(private readonly revenueRepo: IRecurringRevenueRepository) {}

  async execute(id: string): Promise<RecurringRevenue> {
    const revenue = await this.revenueRepo.findById(id);
    if (!revenue) {
      throw new NotFoundError('RecurringRevenue', id);
    }
    return revenue;
  }
}
