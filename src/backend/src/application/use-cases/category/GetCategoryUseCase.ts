import { Category } from '../../../domain/entities/Category.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';

export class GetCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(id: string): Promise<Category> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError('Category', id);
    }
    return category;
  }
}
