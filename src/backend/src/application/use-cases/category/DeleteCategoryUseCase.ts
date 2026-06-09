import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository.js';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError('Category', id);
    }

    return this.categoryRepo.delete(id);
  }
}
