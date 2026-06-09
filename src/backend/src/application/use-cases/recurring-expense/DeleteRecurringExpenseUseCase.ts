import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IRecurringExpenseRepository } from '../../ports/repositories/IRecurringExpenseRepository.js';

export class DeleteRecurringExpenseUseCase {
  constructor(private readonly expenseRepo: IRecurringExpenseRepository) {}

  async execute(id: string): Promise<void> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) {
      throw new NotFoundError('RecurringExpense', id);
    }

    return this.expenseRepo.delete(id);
  }
}
