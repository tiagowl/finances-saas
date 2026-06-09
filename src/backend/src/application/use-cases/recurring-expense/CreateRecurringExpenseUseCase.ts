import { RecurringExpense } from '../../../domain/entities/RecurringExpense.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';
import { IRecurringExpenseRepository } from '../../ports/repositories/IRecurringExpenseRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';

export interface CreateRecurringExpenseInput {
  name: string;
  notes?: string | null;
  price: number;
  installments?: number | null;
  categoryId: string;
  userId: string;
}

export class CreateRecurringExpenseUseCase {
  constructor(
    private readonly expenseRepo: IRecurringExpenseRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: CreateRecurringExpenseInput): Promise<RecurringExpense> {
    const category = await this.categoryRepo.findById(input.categoryId);
    if (!category) {
      throw new NotFoundError('Category', input.categoryId);
    }

    const expense = RecurringExpense.create({
      name: input.name,
      notes: input.notes,
      price: input.price,
      installments: input.installments,
      categoryId: input.categoryId,
      userId: input.userId,
    });

    return this.expenseRepo.save(expense);
  }
}
