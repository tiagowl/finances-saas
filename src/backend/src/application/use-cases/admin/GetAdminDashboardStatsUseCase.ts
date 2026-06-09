import { IUserRepository } from '../../ports/repositories/IUserRepository.js';

export class GetAdminDashboardStatsUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute() {
    const [userCount, pageStats, actionStats] = await Promise.all([
      this.userRepo.getUserCount(),
      this.userRepo.getPageAccessStats(),
      this.userRepo.getActionStats(),
    ]);

    return {
      userCount,
      mostAccessedPages: pageStats,
      mostUsedActions: actionStats,
    };
  }
}
