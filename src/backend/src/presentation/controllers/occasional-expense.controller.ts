import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateOccasionalExpenseUseCase } from '../../application/use-cases/occasional-expense/CreateOccasionalExpenseUseCase.js';
import { ListOccasionalExpensesUseCase } from '../../application/use-cases/occasional-expense/ListOccasionalExpensesUseCase.js';
import { GetOccasionalExpenseUseCase } from '../../application/use-cases/occasional-expense/GetOccasionalExpenseUseCase.js';
import { UpdateOccasionalExpenseUseCase } from '../../application/use-cases/occasional-expense/UpdateOccasionalExpenseUseCase.js';
import { DeleteOccasionalExpenseUseCase } from '../../application/use-cases/occasional-expense/DeleteOccasionalExpenseUseCase.js';
import { GetOccasionalExpenseTotalUseCase } from '../../application/use-cases/occasional-expense/GetOccasionalExpenseTotalUseCase.js';
import { createOccasionalExpenseSchema, updateOccasionalExpenseSchema, expenseParamsSchema, expenseQuerySchema } from '../validators/expense.validator.js';
import { occasionalExpenseToResponse, occasionalExpensesToResponse } from '../dtos/expense.dto.js';

export class OccasionalExpenseController {
  constructor(
    private readonly createUseCase: CreateOccasionalExpenseUseCase,
    private readonly listUseCase: ListOccasionalExpensesUseCase,
    private readonly getUseCase: GetOccasionalExpenseUseCase,
    private readonly updateUseCase: UpdateOccasionalExpenseUseCase,
    private readonly deleteUseCase: DeleteOccasionalExpenseUseCase,
    private readonly totalUseCase: GetOccasionalExpenseTotalUseCase,
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const input = createOccasionalExpenseSchema.parse(request.body);
    const expense = await this.createUseCase.execute({
      ...input,
      date: new Date(input.date),
      userId,
    });
    return reply.status(201).send(occasionalExpenseToResponse(expense));
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const query = expenseQuerySchema.parse(request.query);
    const filters = {
      userId,
      ...query,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: query.page,
      limit: query.limit,
    };
    const { data, total } = await this.listUseCase.execute(filters);
    return reply.send({ data: occasionalExpensesToResponse(data), total });
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = expenseParamsSchema.parse(request.params);
    const expense = await this.getUseCase.execute(id);
    return reply.send(occasionalExpenseToResponse(expense));
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = expenseParamsSchema.parse(request.params);
    const input = updateOccasionalExpenseSchema.parse(request.body);
    const expense = await this.updateUseCase.execute({
      id,
      ...input,
      date: input.date ? new Date(input.date) : undefined,
    });
    return reply.send(occasionalExpenseToResponse(expense));
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = expenseParamsSchema.parse(request.params);
    await this.deleteUseCase.execute(id);
    return reply.status(204).send();
  }

  async total(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const query = expenseQuerySchema.parse(request.query);
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
