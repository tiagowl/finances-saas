import { FastifyRequest, FastifyReply } from 'fastify';
import { GetDashboardStatsUseCase } from '../../application/use-cases/dashboard/GetDashboardStatsUseCase.js';
import { dashboardQuerySchema } from '../validators/dashboard.validator.js';
import { dashboardStatsToResponse } from '../dtos/dashboard.dto.js';

export class DashboardController {
  constructor(
    private readonly getStatsUseCase: GetDashboardStatsUseCase,
  ) {}

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const query = dashboardQuerySchema.parse(request.query);
    const filters = {
      userId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    };
    const stats = await this.getStatsUseCase.execute(filters);
    return reply.send(dashboardStatsToResponse(stats));
  }
}
