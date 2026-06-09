import { FastifyInstance } from 'fastify';
import { OccasionalExpenseController } from '../controllers/occasional-expense.controller.js';

export function registerOccasionalExpenseRoutes(
  app: FastifyInstance,
  controller: OccasionalExpenseController,
) {
  app.post('/api/expenses/occasional', controller.create.bind(controller));
  app.get('/api/expenses/occasional', controller.list.bind(controller));
  app.get('/api/expenses/occasional/total', controller.total.bind(controller));
  app.get('/api/expenses/occasional/:id', controller.getById.bind(controller));
  app.put('/api/expenses/occasional/:id', controller.update.bind(controller));
  app.delete('/api/expenses/occasional/:id', controller.delete.bind(controller));
}
