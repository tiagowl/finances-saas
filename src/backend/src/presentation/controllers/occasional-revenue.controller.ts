import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateOccasionalRevenueUseCase } from '../../application/use-cases/occasional-revenue/CreateOccasionalRevenueUseCase.js';
import { ListOccasionalRevenuesUseCase } from '../../application/use-cases/occasional-revenue/ListOccasionalRevenuesUseCase.js';
import { GetOccasionalRevenueUseCase } from '../../application/use-cases/occasional-revenue/GetOccasionalRevenueUseCase.js';
import { UpdateOccasionalRevenueUseCase } from '../../application/use-cases/occasional-revenue/UpdateOccasionalRevenueUseCase.js';
import { DeleteOccasionalRevenueUseCase } from '../../application/use-cases/occasional-revenue/DeleteOccasionalRevenueUseCase.js';
import { GetOccasionalRevenueTotalUseCase } from '../../application/use-cases/occasional-revenue/GetOccasionalRevenueTotalUseCase.js';
import { createOccasionalRevenueSchema, updateOccasionalRevenueSchema, revenueParamsSchema, revenueQuerySchema } from '../validators/revenue.validator.js';
import { occasionalRevenueToResponse, occasionalRevenuesToResponse } from '../dtos/revenue.dto.js';

export class OccasionalRevenueController {
  constructor(
    private readonly createUseCase: CreateOccasionalRevenueUseCase,
    private readonly listUseCase: ListOccasionalRevenuesUseCase,
    private readonly getUseCase: GetOccasionalRevenueUseCase,
    private readonly updateUseCase: UpdateOccasionalRevenueUseCase,
    private readonly deleteUseCase: DeleteOccasionalRevenueUseCase,
    private readonly totalUseCase: GetOccasionalRevenueTotalUseCase,
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const input = createOccasionalRevenueSchema.parse(request.body);
    const revenue = await this.createUseCase.execute({
      ...input,
      date: new Date(input.date),
      userId,
    });
    return reply.status(201).send(occasionalRevenueToResponse(revenue));
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const query = revenueQuerySchema.parse(request.query);
    const filters = {
      userId,
      ...query,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: query.page,
      limit: query.limit,
    };
    const { data, total } = await this.listUseCase.execute(filters);
    return reply.send({ data: occasionalRevenuesToResponse(data), total });
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = revenueParamsSchema.parse(request.params);
    const revenue = await this.getUseCase.execute(id);
    return reply.send(occasionalRevenueToResponse(revenue));
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = revenueParamsSchema.parse(request.params);
    const input = updateOccasionalRevenueSchema.parse(request.body);
    const revenue = await this.updateUseCase.execute({
      id,
      ...input,
      date: input.date ? new Date(input.date) : undefined,
    });
    return reply.send(occasionalRevenueToResponse(revenue));
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = revenueParamsSchema.parse(request.params);
    await this.deleteUseCase.execute(id);
    return reply.status(204).send();
  }

  async total(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const query = revenueQuerySchema.parse(request.query);
    const filters = {
      userId,
      ...query,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    };
    const total = await this.totalUseCase.execute(filters);
    return reply.send({ total });
  }
}
