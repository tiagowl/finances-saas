import { IRecurringRevenueRepository, RecurringRevenueFilters } from '../../ports/repositories/IRecurringRevenueRepository.js';

export class ListRecurringRevenuesUseCase {
  constructor(private readonly revenueRepo: IRecurringRevenueRepository) {}

  async execute(filters: RecurringRevenueFilters) {
    return this.revenueRepo.findAll(filters);
  }
}
