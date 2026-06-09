import { IOccasionalExpenseRepository, OccasionalExpenseTotalFilters } from '../../ports/repositories/IOccasionalExpenseRepository.js';

export class GetOccasionalExpenseTotalUseCase {
  constructor(private readonly expenseRepo: IOccasionalExpenseRepository) {}

  async execute(filters: OccasionalExpenseTotalFilters): Promise<number> {
    return this.expenseRepo.getTotal(filters);
  }
}
