import { Category } from '../../../domain/entities/Category.js';
import { NotFoundError, ConflictError } from '../../../domain/errors/DomainError.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  notes?: string | null;
  maxBudget?: number | null;
  userId: string;
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<Category> {
    const category = await this.categoryRepo.findById(input.id);
    if (!category) {
      throw new NotFoundError('Category', input.id);
    }

    if (input.name !== undefined) {
      const existing = await this.categoryRepo.findByName(input.name, input.userId);
      if (existing && existing.id !== input.id) {
        throw new ConflictError('Category with this name already exists');
      }
      category.changeName(input.name);
    }

    if (input.notes !== undefined) {
      category.changeNotes(input.notes);
    }

    if (input.maxBudget !== undefined) {
      category.changeMaxBudget(input.maxBudget);
    }

    return this.categoryRepo.update(category);
  }
}
