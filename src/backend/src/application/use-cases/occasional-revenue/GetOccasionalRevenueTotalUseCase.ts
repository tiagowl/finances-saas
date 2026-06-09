import { IOccasionalRevenueRepository, OccasionalRevenueTotalFilters } from '../../ports/repositories/IOccasionalRevenueRepository.js';

export class GetOccasionalRevenueTotalUseCase {
  constructor(private readonly revenueRepo: IOccasionalRevenueRepository) {}

  async execute(filters: OccasionalRevenueTotalFilters): Promise<number> {
    return this.revenueRepo.getTotal(filters);
  }
}
