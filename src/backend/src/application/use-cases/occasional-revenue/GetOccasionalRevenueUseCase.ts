import { OccasionalRevenue } from '../../../domain/entities/OccasionalRevenue.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IOccasionalRevenueRepository } from '../../ports/repositories/IOccasionalRevenueRepository.js';

export class GetOccasionalRevenueUseCase {
  constructor(private readonly revenueRepo: IOccasionalRevenueRepository) {}

  async execute(id: string): Promise<OccasionalRevenue> {
    const revenue = await this.revenueRepo.findById(id);
    if (!revenue) {
      throw new NotFoundError('OccasionalRevenue', id);
    }
    return revenue;
  }
}
