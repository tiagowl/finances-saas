import { FastifyInstance } from 'fastify';
import { DashboardController } from '../controllers/dashboard.controller.js';

export function registerDashboardRoutes(
  app: FastifyInstance,
  controller: DashboardController,
) {
  app.get('/api/dashboard', controller.getStats.bind(controller));
}
