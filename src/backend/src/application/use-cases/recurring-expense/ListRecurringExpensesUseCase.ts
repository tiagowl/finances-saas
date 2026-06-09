import { IRecurringExpenseRepository, RecurringExpenseFilters } from '../../ports/repositories/IRecurringExpenseRepository.js';

export class ListRecurringExpensesUseCase {
  constructor(private readonly expenseRepo: IRecurringExpenseRepository) {}

  async execute(filters: RecurringExpenseFilters) {
    return this.expenseRepo.findAll(filters);
  }
}
