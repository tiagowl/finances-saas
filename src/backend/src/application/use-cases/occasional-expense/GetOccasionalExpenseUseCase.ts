import { OccasionalExpense } from '../../../domain/entities/OccasionalExpense.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IOccasionalExpenseRepository } from '../../ports/repositories/IOccasionalExpenseRepository.js';

export class GetOccasionalExpenseUseCase {
  constructor(private readonly expenseRepo: IOccasionalExpenseRepository) {}

  async execute(id: string): Promise<OccasionalExpense> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) {
      throw new NotFoundError('OccasionalExpense', id);
    }
    return expense;
  }
}
