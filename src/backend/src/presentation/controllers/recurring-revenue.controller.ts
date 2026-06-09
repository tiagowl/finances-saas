import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateRecurringRevenueUseCase } from '../../application/use-cases/recurring-revenue/CreateRecurringRevenueUseCase.js';
import { ListRecurringRevenuesUseCase } from '../../application/use-cases/recurring-revenue/ListRecurringRevenuesUseCase.js';
import { GetRecurringRevenueUseCase } from '../../application/use-cases/recurring-revenue/GetRecurringRevenueUseCase.js';
import { UpdateRecurringRevenueUseCase } from '../../application/use-cases/recurring-revenue/UpdateRecurringRevenueUseCase.js';
import { DeleteRecurringRevenueUseCase } from '../../application/use-cases/recurring-revenue/DeleteRecurringRevenueUseCase.js';
import { GetRecurringRevenueTotalUseCase } from '../../application/use-cases/recurring-revenue/GetRecurringRevenueTotalUseCase.js';
import { createRecurringRevenueSchema, updateRecurringRevenueSchema, revenueParamsSchema, revenueQuerySchema } from '../validators/revenue.validator.js';
import { recurringRevenueToResponse, recurringRevenuesToResponse } from '../dtos/revenue.dto.js';

export class RecurringRevenueController {
  constructor(
    private readonly createUseCase: CreateRecurringRevenueUseCase,
    private readonly listUseCase: ListRecurringRevenuesUseCase,
    private readonly getUseCase: GetRecurringRevenueUseCase,
    private readonly updateUseCase: UpdateRecurringRevenueUseCase,
    private readonly deleteUseCase: DeleteRecurringRevenueUseCase,
    private readonly totalUseCase: GetRecurringRevenueTotalUseCase,
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const input = createRecurringRevenueSchema.parse(request.body);
    const revenue = await this.createUseCase.execute({ ...input, userId });
    return reply.status(201).send(recurringRevenueToResponse(revenue));
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const query = revenueQuerySchema.parse(request.query);
    const { data, total } = await this.listUseCase.execute({
      userId,
      categoryId: query.categoryId,
      search: query.search,
      sortBy: query.sortBy as 'name' | 'price' | undefined,
      sortOrder: query.sortOrder as 'asc' | 'desc' | undefined,
      page: query.page,
      limit: query.limit,
    });
    return reply.send({ data: recurringRevenuesToResponse(data), total });
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = revenueParamsSchema.parse(request.params);
    const revenue = await this.getUseCase.execute(id);
    return reply.send(recurringRevenueToResponse(revenue));
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = revenueParamsSchema.parse(request.params);
    const input = updateRecurringRevenueSchema.parse(request.body);
    const revenue = await this.updateUseCase.execute({ id, ...input });
    return reply.send(recurringRevenueToResponse(revenue));
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
    const total = await this.totalUseCase.execute({
      userId,
      categoryId: query.categoryId,
    });
    return reply.send({ total });
  }
}
