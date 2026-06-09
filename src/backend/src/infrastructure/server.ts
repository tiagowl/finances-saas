import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';

import { PrismaCategoryRepository } from './database/repositories/PrismaCategoryRepository.js';
import { PrismaOccasionalExpenseRepository } from './database/repositories/PrismaOccasionalExpenseRepository.js';
import { PrismaRecurringExpenseRepository } from './database/repositories/PrismaRecurringExpenseRepository.js';
import { PrismaOccasionalRevenueRepository } from './database/repositories/PrismaOccasionalRevenueRepository.js';
import { PrismaRecurringRevenueRepository } from './database/repositories/PrismaRecurringRevenueRepository.js';
import { PrismaUserRepository } from './database/repositories/PrismaUserRepository.js';

import { CreateCategoryUseCase } from '../application/use-cases/category/CreateCategoryUseCase.js';
import { ListCategoriesUseCase } from '../application/use-cases/category/ListCategoriesUseCase.js';
import { GetCategoryUseCase } from '../application/use-cases/category/GetCategoryUseCase.js';
import { UpdateCategoryUseCase } from '../application/use-cases/category/UpdateCategoryUseCase.js';
import { DeleteCategoryUseCase } from '../application/use-cases/category/DeleteCategoryUseCase.js';

import { CreateOccasionalExpenseUseCase } from '../application/use-cases/occasional-expense/CreateOccasionalExpenseUseCase.js';
import { ListOccasionalExpensesUseCase } from '../application/use-cases/occasional-expense/ListOccasionalExpensesUseCase.js';
import { GetOccasionalExpenseUseCase } from '../application/use-cases/occasional-expense/GetOccasionalExpenseUseCase.js';
import { UpdateOccasionalExpenseUseCase } from '../application/use-cases/occasional-expense/UpdateOccasionalExpenseUseCase.js';
import { DeleteOccasionalExpenseUseCase } from '../application/use-cases/occasional-expense/DeleteOccasionalExpenseUseCase.js';
import { GetOccasionalExpenseTotalUseCase } from '../application/use-cases/occasional-expense/GetOccasionalExpenseTotalUseCase.js';

import { CreateRecurringExpenseUseCase } from '../application/use-cases/recurring-expense/CreateRecurringExpenseUseCase.js';
import { ListRecurringExpensesUseCase } from '../application/use-cases/recurring-expense/ListRecurringExpensesUseCase.js';
import { GetRecurringExpenseUseCase } from '../application/use-cases/recurring-expense/GetRecurringExpenseUseCase.js';
import { UpdateRecurringExpenseUseCase } from '../application/use-cases/recurring-expense/UpdateRecurringExpenseUseCase.js';
import { DeleteRecurringExpenseUseCase } from '../application/use-cases/recurring-expense/DeleteRecurringExpenseUseCase.js';
import { GetRecurringExpenseTotalUseCase } from '../application/use-cases/recurring-expense/GetRecurringExpenseTotalUseCase.js';

import { CreateOccasionalRevenueUseCase } from '../application/use-cases/occasional-revenue/CreateOccasionalRevenueUseCase.js';
import { ListOccasionalRevenuesUseCase } from '../application/use-cases/occasional-revenue/ListOccasionalRevenuesUseCase.js';
import { GetOccasionalRevenueUseCase } from '../application/use-cases/occasional-revenue/GetOccasionalRevenueUseCase.js';
import { UpdateOccasionalRevenueUseCase } from '../application/use-cases/occasional-revenue/UpdateOccasionalRevenueUseCase.js';
import { DeleteOccasionalRevenueUseCase } from '../application/use-cases/occasional-revenue/DeleteOccasionalRevenueUseCase.js';
import { GetOccasionalRevenueTotalUseCase } from '../application/use-cases/occasional-revenue/GetOccasionalRevenueTotalUseCase.js';

import { CreateRecurringRevenueUseCase } from '../application/use-cases/recurring-revenue/CreateRecurringRevenueUseCase.js';
import { ListRecurringRevenuesUseCase } from '../application/use-cases/recurring-revenue/ListRecurringRevenuesUseCase.js';
import { GetRecurringRevenueUseCase } from '../application/use-cases/recurring-revenue/GetRecurringRevenueUseCase.js';
import { UpdateRecurringRevenueUseCase } from '../application/use-cases/recurring-revenue/UpdateRecurringRevenueUseCase.js';
import { DeleteRecurringRevenueUseCase } from '../application/use-cases/recurring-revenue/DeleteRecurringRevenueUseCase.js';
import { GetRecurringRevenueTotalUseCase } from '../application/use-cases/recurring-revenue/GetRecurringRevenueTotalUseCase.js';

import { RegisterUseCase } from '../application/use-cases/auth/RegisterUseCase.js';
import { LoginUseCase } from '../application/use-cases/auth/LoginUseCase.js';
import { UpdateProfileUseCase } from '../application/use-cases/auth/UpdateProfileUseCase.js';

import { GetDashboardStatsUseCase } from '../application/use-cases/dashboard/GetDashboardStatsUseCase.js';

import { ListUsersUseCase } from '../application/use-cases/admin/ListUsersUseCase.js';
import { GetUserUseCase } from '../application/use-cases/admin/GetUserUseCase.js';
import { GetAdminDashboardStatsUseCase } from '../application/use-cases/admin/GetAdminDashboardStatsUseCase.js';
import { GetAccessLogUseCase } from '../application/use-cases/admin/GetAccessLogUseCase.js';

import { CategoryController } from '../presentation/controllers/category.controller.js';
import { OccasionalExpenseController } from '../presentation/controllers/occasional-expense.controller.js';
import { RecurringExpenseController } from '../presentation/controllers/recurring-expense.controller.js';
import { OccasionalRevenueController } from '../presentation/controllers/occasional-revenue.controller.js';
import { RecurringRevenueController } from '../presentation/controllers/recurring-revenue.controller.js';
import { DashboardController } from '../presentation/controllers/dashboard.controller.js';
import { AuthController } from '../presentation/controllers/auth.controller.js';
import { AdminController } from '../presentation/controllers/admin.controller.js';

import { registerCategoryRoutes } from '../presentation/routes/category.routes.js';
import { registerOccasionalExpenseRoutes } from '../presentation/routes/occasional-expense.routes.js';
import { registerRecurringExpenseRoutes } from '../presentation/routes/recurring-expense.routes.js';
import { registerOccasionalRevenueRoutes } from '../presentation/routes/occasional-revenue.routes.js';
import { registerRecurringRevenueRoutes } from '../presentation/routes/recurring-revenue.routes.js';
import { registerDashboardRoutes } from '../presentation/routes/dashboard.routes.js';
import { registerAuthRoutes } from '../presentation/routes/auth.routes.js';
import { registerAdminRoutes } from '../presentation/routes/admin.routes.js';
import { registerAccessLogHook } from './accessLogMiddleware.js';

import { DomainError, NotFoundError, ConflictError, ValidationError } from '../domain/errors/DomainError.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

const isProduction = process.env.NODE_ENV === 'production';

const app = Fastify({
  logger: isProduction ? { level: 'warn' } : true,
});

async function bootstrap() {
  await app.register(cors, {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:5173'],
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  if (!isProduction) {
    await app.register(swagger, {
      openapi: {
        info: {
          title: 'Finances SaaS API',
          description: 'API for personal finance management',
          version: '1.0.0',
        },
      },
    });

    await app.register(swaggerUi, {
      routePrefix: '/docs',
    });
  }

  // JWT
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production',
  });

  // Repositories
  const categoryRepo = new PrismaCategoryRepository();
  const occasionalExpenseRepo = new PrismaOccasionalExpenseRepository();
  const recurringExpenseRepo = new PrismaRecurringExpenseRepository();
  const occasionalRevenueRepo = new PrismaOccasionalRevenueRepository();
  const recurringRevenueRepo = new PrismaRecurringRevenueRepository();
  const userRepo = new PrismaUserRepository();

  // Use Cases - Auth
  const registerUseCase = new RegisterUseCase(userRepo);
  const loginUseCase = new LoginUseCase(userRepo);
  const updateProfileUseCase = new UpdateProfileUseCase(userRepo);

  // Use Cases - Category
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepo);
  const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepo);
  const getCategoryUseCase = new GetCategoryUseCase(categoryRepo);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepo);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo);

  // Use Cases - Occasional Expense
  const createOccasionalExpenseUseCase = new CreateOccasionalExpenseUseCase(occasionalExpenseRepo, categoryRepo);
  const listOccasionalExpensesUseCase = new ListOccasionalExpensesUseCase(occasionalExpenseRepo);
  const getOccasionalExpenseUseCase = new GetOccasionalExpenseUseCase(occasionalExpenseRepo);
  const updateOccasionalExpenseUseCase = new UpdateOccasionalExpenseUseCase(occasionalExpenseRepo, categoryRepo);
  const deleteOccasionalExpenseUseCase = new DeleteOccasionalExpenseUseCase(occasionalExpenseRepo);
  const getOccasionalExpenseTotalUseCase = new GetOccasionalExpenseTotalUseCase(occasionalExpenseRepo);

  // Use Cases - Recurring Expense
  const createRecurringExpenseUseCase = new CreateRecurringExpenseUseCase(recurringExpenseRepo, categoryRepo);
  const listRecurringExpensesUseCase = new ListRecurringExpensesUseCase(recurringExpenseRepo);
  const getRecurringExpenseUseCase = new GetRecurringExpenseUseCase(recurringExpenseRepo);
  const updateRecurringExpenseUseCase = new UpdateRecurringExpenseUseCase(recurringExpenseRepo, categoryRepo);
  const deleteRecurringExpenseUseCase = new DeleteRecurringExpenseUseCase(recurringExpenseRepo);
  const getRecurringExpenseTotalUseCase = new GetRecurringExpenseTotalUseCase(recurringExpenseRepo);

  // Use Cases - Occasional Revenue
  const createOccasionalRevenueUseCase = new CreateOccasionalRevenueUseCase(occasionalRevenueRepo, categoryRepo);
  const listOccasionalRevenuesUseCase = new ListOccasionalRevenuesUseCase(occasionalRevenueRepo);
  const getOccasionalRevenueUseCase = new GetOccasionalRevenueUseCase(occasionalRevenueRepo);
  const updateOccasionalRevenueUseCase = new UpdateOccasionalRevenueUseCase(occasionalRevenueRepo, categoryRepo);
  const deleteOccasionalRevenueUseCase = new DeleteOccasionalRevenueUseCase(occasionalRevenueRepo);
  const getOccasionalRevenueTotalUseCase = new GetOccasionalRevenueTotalUseCase(occasionalRevenueRepo);

  // Use Cases - Recurring Revenue
  const createRecurringRevenueUseCase = new CreateRecurringRevenueUseCase(recurringRevenueRepo, categoryRepo);
  const listRecurringRevenuesUseCase = new ListRecurringRevenuesUseCase(recurringRevenueRepo);
  const getRecurringRevenueUseCase = new GetRecurringRevenueUseCase(recurringRevenueRepo);
  const updateRecurringRevenueUseCase = new UpdateRecurringRevenueUseCase(recurringRevenueRepo, categoryRepo);
  const deleteRecurringRevenueUseCase = new DeleteRecurringRevenueUseCase(recurringRevenueRepo);
  const getRecurringRevenueTotalUseCase = new GetRecurringRevenueTotalUseCase(recurringRevenueRepo);

  // Use Cases - Dashboard
  const getDashboardStatsUseCase = new GetDashboardStatsUseCase(
    occasionalExpenseRepo,
    recurringExpenseRepo,
    occasionalRevenueRepo,
    recurringRevenueRepo,
  );

  // Use Cases - Admin
  const listUsersUseCase = new ListUsersUseCase(userRepo);
  const getUserUseCase = new GetUserUseCase(userRepo);
  const getAdminDashboardStatsUseCase = new GetAdminDashboardStatsUseCase(userRepo);
  const getAccessLogUseCase = new GetAccessLogUseCase(userRepo);

  // Controllers
  const authController = new AuthController(registerUseCase, loginUseCase, updateProfileUseCase);

  const categoryController = new CategoryController(
    createCategoryUseCase,
    listCategoriesUseCase,
    getCategoryUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,
  );

  const occasionalExpenseController = new OccasionalExpenseController(
    createOccasionalExpenseUseCase,
    listOccasionalExpensesUseCase,
    getOccasionalExpenseUseCase,
    updateOccasionalExpenseUseCase,
    deleteOccasionalExpenseUseCase,
    getOccasionalExpenseTotalUseCase,
  );

  const recurringExpenseController = new RecurringExpenseController(
    createRecurringExpenseUseCase,
    listRecurringExpensesUseCase,
    getRecurringExpenseUseCase,
    updateRecurringExpenseUseCase,
    deleteRecurringExpenseUseCase,
    getRecurringExpenseTotalUseCase,
  );

  const occasionalRevenueController = new OccasionalRevenueController(
    createOccasionalRevenueUseCase,
    listOccasionalRevenuesUseCase,
    getOccasionalRevenueUseCase,
    updateOccasionalRevenueUseCase,
    deleteOccasionalRevenueUseCase,
    getOccasionalRevenueTotalUseCase,
  );

  const recurringRevenueController = new RecurringRevenueController(
    createRecurringRevenueUseCase,
    listRecurringRevenuesUseCase,
    getRecurringRevenueUseCase,
    updateRecurringRevenueUseCase,
    deleteRecurringRevenueUseCase,
    getRecurringRevenueTotalUseCase,
  );

  const dashboardController = new DashboardController(getDashboardStatsUseCase);

  const adminController = new AdminController(
    listUsersUseCase,
    getUserUseCase,
    getAdminDashboardStatsUseCase,
    getAccessLogUseCase,
  );

  // Access log hook (must be registered after JWT hook)
  registerAccessLogHook(app, userRepo);

  // Error Handler
  app.setErrorHandler(async (error, request, reply) => {
    (request as any).__errorDetails = { message: error.message, stack: error.stack };
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof ValidationError) {
      return reply.status(422).send({
        statusCode: 422,
        message: error.message,
        errors: error.errors,
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        statusCode: 404,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof ConflictError) {
      return reply.status(409).send({
        statusCode: 409,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof DomainError) {
      return reply.status(400).send({
        statusCode: 400,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    if (error.statusCode === 401) {
      return reply.status(401).send({
        statusCode: 401,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Cannot delete record that is still referenced by other records',
          timestamp: new Date().toISOString(),
        });
      }
    }

    app.log.error(error);
    return reply.status(500).send({
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  });

  // Auth routes (unprotected)
  registerAuthRoutes(app, authController);

  // Health check (unprotected)
  app.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // JWT verification hook for all protected routes
  app.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/auth') || request.url === '/api/health') return;
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  });

  // Protected routes
  registerCategoryRoutes(app, categoryController);
  registerOccasionalExpenseRoutes(app, occasionalExpenseController);
  registerRecurringExpenseRoutes(app, recurringExpenseController);
  registerOccasionalRevenueRoutes(app, occasionalRevenueController);
  registerRecurringRevenueRoutes(app, recurringRevenueController);
  registerDashboardRoutes(app, dashboardController);
  registerAdminRoutes(app, adminController);

  const port = parseInt(process.env.PORT ?? '3000', 10);
  const host = process.env.HOST ?? '0.0.0.0';

  try {
    await app.listen({ port, host });
    app.log.info(`Server running at http://${host}:${port}`);
    if (!isProduction) {
      app.log.info(`Swagger docs at http://${host}:${port}/docs`);
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
