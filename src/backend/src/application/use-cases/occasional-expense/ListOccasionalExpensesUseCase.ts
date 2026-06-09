import { IOccasionalExpenseRepository, OccasionalExpenseFilters } from '../../ports/repositories/IOccasionalExpenseRepository.js';

export class ListOccasionalExpensesUseCase {
  constructor(private readonly expenseRepo: IOccasionalExpenseRepository) {}

  async execute(filters: OccasionalExpenseFilters) {
    return this.expenseRepo.findAll(filters);
  }
}
