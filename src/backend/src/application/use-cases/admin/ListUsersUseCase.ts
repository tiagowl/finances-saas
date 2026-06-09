import { IUserRepository } from '../../ports/repositories/IUserRepository.js';

export class ListUsersUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(search?: string) {
    const users = await this.userRepo.findAll(search);
    return users.map((u) => u.toJSON());
  }
}
