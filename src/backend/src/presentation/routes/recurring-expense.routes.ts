import { FastifyInstance } from 'fastify';
import { RecurringExpenseController } from '../controllers/recurring-expense.controller.js';

export function registerRecurringExpenseRoutes(
  app: FastifyInstance,
  controller: RecurringExpenseController,
) {
  app.post('/api/expenses/recurring', controller.create.bind(controller));
  app.get('/api/expenses/recurring', controller.list.bind(controller));
  app.get('/api/expenses/recurring/total', controller.total.bind(controller));
  app.get('/api/expenses/recurring/:id', controller.getById.bind(controller));
  app.put('/api/expenses/recurring/:id', controller.update.bind(controller));
  app.delete('/api/expenses/recurring/:id', controller.delete.bind(controller));
}
