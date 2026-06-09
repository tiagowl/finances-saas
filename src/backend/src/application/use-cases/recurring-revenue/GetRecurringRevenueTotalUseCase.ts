import { IRecurringRevenueRepository, RecurringRevenueTotalFilters } from '../../ports/repositories/IRecurringRevenueRepository.js';

export class GetRecurringRevenueTotalUseCase {
  constructor(private readonly revenueRepo: IRecurringRevenueRepository) {}

  async execute(filters: RecurringRevenueTotalFilters): Promise<number> {
    return this.revenueRepo.getTotal(filters);
  }
}
