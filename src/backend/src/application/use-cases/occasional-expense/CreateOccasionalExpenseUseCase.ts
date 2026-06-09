import { OccasionalExpense } from '../../../domain/entities/OccasionalExpense.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';
import { IOccasionalExpenseRepository } from '../../ports/repositories/IOccasionalExpenseRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';

export interface CreateOccasionalExpenseInput {
  name: string;
  notes?: string | null;
  price: number;
  date: Date;
  categoryId: string;
  userId: string;
}

export class CreateOccasionalExpenseUseCase {
  constructor(
    private readonly expenseRepo: IOccasionalExpenseRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: CreateOccasionalExpenseInput): Promise<OccasionalExpense> {
    const category = await this.categoryRepo.findById(input.categoryId);
    if (!category) {
      throw new NotFoundError('Category', input.categoryId);
    }

    const expense = OccasionalExpense.create({
      name: input.name,
      notes: input.notes,
      price: input.price,
      date: input.date,
      categoryId: input.categoryId,
      userId: input.userId,
    });

    return this.expenseRepo.save(expense);
  }
}
