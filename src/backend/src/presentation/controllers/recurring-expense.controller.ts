import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateRecurringExpenseUseCase } from '../../application/use-cases/recurring-expense/CreateRecurringExpenseUseCase.js';
import { ListRecurringExpensesUseCase } from '../../application/use-cases/recurring-expense/ListRecurringExpensesUseCase.js';
import { GetRecurringExpenseUseCase } from '../../application/use-cases/recurring-expense/GetRecurringExpenseUseCase.js';
import { UpdateRecurringExpenseUseCase } from '../../application/use-cases/recurring-expense/UpdateRecurringExpenseUseCase.js';
import { DeleteRecurringExpenseUseCase } from '../../application/use-cases/recurring-expense/DeleteRecurringExpenseUseCase.js';
import { GetRecurringExpenseTotalUseCase } from '../../application/use-cases/recurring-expense/GetRecurringExpenseTotalUseCase.js';
import { createRecurringExpenseSchema, updateRecurringExpenseSchema, expenseParamsSchema, expenseQuerySchema } from '../validators/expense.validator.js';
import { recurringExpenseToResponse, recurringExpensesToResponse } from '../dtos/expense.dto.js';

export class RecurringExpenseController {
  constructor(
    private readonly createUseCase: CreateRecurringExpenseUseCase,
    private readonly listUseCase: ListRecurringExpensesUseCase,
    private readonly getUseCase: GetRecurringExpenseUseCase,
    private readonly updateUseCase: UpdateRecurringExpenseUseCase,
    private readonly deleteUseCase: DeleteRecurringExpenseUseCase,
    private readonly totalUseCase: GetRecurringExpenseTotalUseCase,
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const input = createRecurringExpenseSchema.parse(request.body);
    const expense = await this.createUseCase.execute({ ...input, userId });
    return reply.status(201).send(recurringExpenseToResponse(expense));
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const query = expenseQuerySchema.parse(request.query);
    const { data, total } = await this.listUseCase.execute({
      userId,
      categoryId: query.categoryId,
      search: query.search,
      sortBy: query.sortBy as 'name' | 'price' | undefined,
      sortOrder: query.sortOrder as 'asc' | 'desc' | undefined,
      page: query.page,
      limit: query.limit,
    });
    return reply.send({ data: recurringExpensesToResponse(data), total });
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = expenseParamsSchema.parse(request.params);
    const expense = await this.getUseCase.execute(id);
    return reply.send(recurringExpenseToResponse(expense));
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = expenseParamsSchema.parse(request.params);
    const input = updateRecurringExpenseSchema.parse(request.body);
    const expense = await this.updateUseCase.execute({ id, ...input });
    return reply.send(recurringExpenseToResponse(expense));
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
    const total = await this.totalUseCase.execute({
      userId,
      categoryId: query.categoryId,
    });
    return reply.send({ total });
  }
}
