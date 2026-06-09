import { ICategoryRepository, CategoryFilters } from '../../ports/repositories/ICategoryRepository.js';

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(filters: CategoryFilters) {
    return this.categoryRepo.findAll(filters);
  }
}
