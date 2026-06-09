import { RecurringExpense } from '../../../domain/entities/RecurringExpense.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IRecurringExpenseRepository } from '../../ports/repositories/IRecurringExpenseRepository.js';

export class GetRecurringExpenseUseCase {
  constructor(private readonly expenseRepo: IRecurringExpenseRepository) {}

  async execute(id: string): Promise<RecurringExpense> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) {
      throw new NotFoundError('RecurringExpense', id);
    }
    return expense;
  }
}
