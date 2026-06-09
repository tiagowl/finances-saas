import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IOccasionalExpenseRepository } from '../../ports/repositories/IOccasionalExpenseRepository.js';

export class DeleteOccasionalExpenseUseCase {
  constructor(private readonly expenseRepo: IOccasionalExpenseRepository) {}

  async execute(id: string): Promise<void> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) {
      throw new NotFoundError('OccasionalExpense', id);
    }

    return this.expenseRepo.delete(id);
  }
}
