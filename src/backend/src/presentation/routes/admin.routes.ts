import { FastifyInstance } from 'fastify';
import { AdminController } from '../controllers/admin.controller.js';

export function registerAdminRoutes(
  app: FastifyInstance,
  controller: AdminController,
) {
  app.get('/api/admin/dashboard', controller.getDashboardStats.bind(controller));
  app.get('/api/admin/users', controller.listUsers.bind(controller));
  app.get('/api/admin/users/:id', controller.getUser.bind(controller));
  app.get('/api/admin/access-logs/:id', controller.getAccessLog.bind(controller));
}
