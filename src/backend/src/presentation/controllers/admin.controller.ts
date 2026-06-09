import { FastifyRequest, FastifyReply } from 'fastify';
import { ListUsersUseCase } from '../../application/use-cases/admin/ListUsersUseCase.js';
import { GetUserUseCase } from '../../application/use-cases/admin/GetUserUseCase.js';
import { GetAdminDashboardStatsUseCase } from '../../application/use-cases/admin/GetAdminDashboardStatsUseCase.js';
import { GetAccessLogUseCase } from '../../application/use-cases/admin/GetAccessLogUseCase.js';

export class AdminController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAdminDashboardStatsUseCase: GetAdminDashboardStatsUseCase,
    private readonly getAccessLogUseCase: GetAccessLogUseCase,
  ) {}

  async getDashboardStats(_request: FastifyRequest, reply: FastifyReply) {
    const stats = await this.getAdminDashboardStatsUseCase.execute();
    return reply.send(stats);
  }

  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    const { search } = request.query as { search?: string };
    const users = await this.listUsersUseCase.execute(search);
    return reply.send(users);
  }

  async getUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { startDate, endDate, status, action, page, limit } = request.query as {
      startDate?: string; endDate?: string; status?: string; action?: string; page?: string; limit?: string;
    };
    const result = await this.getUserUseCase.execute(id, {
      startDate, endDate, status, action,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return reply.send(result);
  }

  async getAccessLog(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await this.getAccessLogUseCase.execute(id);
    return reply.send(result);
  }
}
