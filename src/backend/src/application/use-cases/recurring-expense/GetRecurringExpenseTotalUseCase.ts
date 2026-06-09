import { IRecurringExpenseRepository, RecurringExpenseTotalFilters } from '../../ports/repositories/IRecurringExpenseRepository.js';

export class GetRecurringExpenseTotalUseCase {
  constructor(private readonly expenseRepo: IRecurringExpenseRepository) {}

  async execute(filters: RecurringExpenseTotalFilters): Promise<number> {
    return this.expenseRepo.getTotal(filters);
  }
}
