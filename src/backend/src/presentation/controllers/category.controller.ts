import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateCategoryUseCase } from '../../application/use-cases/category/CreateCategoryUseCase.js';
import { ListCategoriesUseCase } from '../../application/use-cases/category/ListCategoriesUseCase.js';
import { GetCategoryUseCase } from '../../application/use-cases/category/GetCategoryUseCase.js';
import { UpdateCategoryUseCase } from '../../application/use-cases/category/UpdateCategoryUseCase.js';
import { DeleteCategoryUseCase } from '../../application/use-cases/category/DeleteCategoryUseCase.js';
import { createCategorySchema, updateCategorySchema, categoryParamsSchema } from '../validators/category.validator.js';
import { categoryToResponse, categoriesToResponse } from '../dtos/category.dto.js';

export class CategoryController {
  constructor(
    private readonly createUseCase: CreateCategoryUseCase,
    private readonly listUseCase: ListCategoriesUseCase,
    private readonly getUseCase: GetCategoryUseCase,
    private readonly updateUseCase: UpdateCategoryUseCase,
    private readonly deleteUseCase: DeleteCategoryUseCase,
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const input = createCategorySchema.parse(request.body);
    const category = await this.createUseCase.execute({ ...input, userId });
    return reply.status(201).send(categoryToResponse(category));
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const query = request.query as { page?: string; limit?: string };
    const { data, total } = await this.listUseCase.execute({
      userId,
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
    });
    return reply.send({ data: categoriesToResponse(data), total });
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = categoryParamsSchema.parse(request.params);
    const category = await this.getUseCase.execute(id);
    return reply.send(categoryToResponse(category));
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const { id } = categoryParamsSchema.parse(request.params);
    const input = updateCategorySchema.parse(request.body);
    const category = await this.updateUseCase.execute({ id, ...input, userId });
    return reply.send(categoryToResponse(category));
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const { id } = categoryParamsSchema.parse(request.params);
    await this.deleteUseCase.execute(id);
    return reply.status(204).send();
  }
}
