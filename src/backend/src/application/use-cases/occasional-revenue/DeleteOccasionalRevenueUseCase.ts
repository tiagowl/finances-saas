import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IOccasionalRevenueRepository } from '../../ports/repositories/IOccasionalRevenueRepository.js';

export class DeleteOccasionalRevenueUseCase {
  constructor(private readonly revenueRepo: IOccasionalRevenueRepository) {}

  async execute(id: string): Promise<void> {
    const revenue = await this.revenueRepo.findById(id);
    if (!revenue) {
      throw new NotFoundError('OccasionalRevenue', id);
    }

    return this.revenueRepo.delete(id);
  }
}
