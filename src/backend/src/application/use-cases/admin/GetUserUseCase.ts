import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IUserRepository, AccessLogFilters } from '../../ports/repositories/IUserRepository.js';

export class GetUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string, filters?: AccessLogFilters) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User', userId);

    const result = await this.userRepo.getAccessLogsByUser(userId, filters);

    return {
      user: user.toJSON(),
      accessLogs: result.data,
      totalAccesses: result.total,
    };
  }
}
