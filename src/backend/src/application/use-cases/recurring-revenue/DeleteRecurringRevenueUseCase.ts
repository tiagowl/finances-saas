import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IRecurringRevenueRepository } from '../../ports/repositories/IRecurringRevenueRepository.js';

export class DeleteRecurringRevenueUseCase {
  constructor(private readonly revenueRepo: IRecurringRevenueRepository) {}

  async execute(id: string): Promise<void> {
    const revenue = await this.revenueRepo.findById(id);
    if (!revenue) {
      throw new NotFoundError('RecurringRevenue', id);
    }

    return this.revenueRepo.delete(id);
  }
}
