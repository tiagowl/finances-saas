import { RecurringExpense } from '../../../domain/entities/RecurringExpense.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';
import { IRecurringExpenseRepository } from '../../ports/repositories/IRecurringExpenseRepository.js';

export interface UpdateRecurringExpenseInput {
  id: string;
  name?: string;
  notes?: string | null;
  price?: number;
  installments?: number | null;
  categoryId?: string;
}

export class UpdateRecurringExpenseUseCase {
  constructor(
    private readonly expenseRepo: IRecurringExpenseRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: UpdateRecurringExpenseInput): Promise<RecurringExpense> {
    const expense = await this.expenseRepo.findById(input.id);
    if (!expense) {
      throw new NotFoundError('RecurringExpense', input.id);
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
    if (input.installments !== undefined) expense.changeInstallments(input.installments);

    return this.expenseRepo.update(expense);
  }
}
