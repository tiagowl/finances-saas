import { IOccasionalRevenueRepository, OccasionalRevenueFilters } from '../../ports/repositories/IOccasionalRevenueRepository.js';

export class ListOccasionalRevenuesUseCase {
  constructor(private readonly revenueRepo: IOccasionalRevenueRepository) {}

  async execute(filters: OccasionalRevenueFilters) {
    return this.revenueRepo.findAll(filters);
  }
}
