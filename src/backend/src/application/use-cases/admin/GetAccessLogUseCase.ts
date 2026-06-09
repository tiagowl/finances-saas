import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IUserRepository } from '../../ports/repositories/IUserRepository.js';

export class GetAccessLogUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(id: string) {
    const log = await this.userRepo.getAccessLogById(id);
    if (!log) throw new NotFoundError('AccessLog', id);

    const user = await this.userRepo.findById(log.userId);
    const userName = user?.name ?? 'Unknown';

    return {
      ...log,
      userName,
    };
  }
}
