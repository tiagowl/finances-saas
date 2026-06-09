import { Category } from '../../../domain/entities/Category.js';
import { ConflictError } from '../../../domain/errors/DomainError.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';

export interface CreateCategoryInput {
  name: string;
  notes?: string | null;
  maxBudget?: number | null;
  userId: string;
}

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<Category> {
    const existing = await this.categoryRepo.findByName(input.name, input.userId);
    if (existing) {
      throw new ConflictError('Category with this name already exists');
    }

    const category = Category.create({
      name: input.name,
      notes: input.notes,
      maxBudget: input.maxBudget,
      userId: input.userId,
    });

    return this.categoryRepo.save(category);
  }
}
