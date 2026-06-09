import { OccasionalExpense } from '../../../domain/entities/OccasionalExpense.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';
import { IOccasionalExpenseRepository } from '../../ports/repositories/IOccasionalExpenseRepository.js';

export interface UpdateOccasionalExpenseInput {
  id: string;
  name?: string;
  notes?: string | null;
  price?: number;
  date?: Date;
  categoryId?: string;
}

export class UpdateOccasionalExpenseUseCase {
  constructor(
    private readonly expenseRepo: IOccasionalExpenseRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: UpdateOccasionalExpenseInput): Promise<OccasionalExpense> {
    const expense = await this.expenseRepo.findById(input.id);
    if (!expense) {
      throw new NotFoundError('OccasionalExpense', input.id);
    }

    if (input.categoryId !== undefined) {
      const category = await this.categoryRepo.findById(input.categoryId);
      if (!category) {
        throw new NotFoundError('Category', input.categoryId);
      }
      expense.changeCategory(input.categoryId);
    }

    if (input.name !== undefined) expense.changeName(input.name);
    if (input.notes !== undefined) expense.changeNotes(input.notes);
    if (input.price !== undefined) expense.changePrice(input.price);
    if (input.date !== undefined) expense.changeDate(input.date);

    return this.expenseRepo.update(expense);
  }
}
