import { FastifyInstance } from 'fastify';
import { RecurringRevenueController } from '../controllers/recurring-revenue.controller.js';

export function registerRecurringRevenueRoutes(
  app: FastifyInstance,
  controller: RecurringRevenueController,
) {
  app.post('/api/revenues/recurring', controller.create.bind(controller));
  app.get('/api/revenues/recurring', controller.list.bind(controller));
  app.get('/api/revenues/recurring/total', controller.total.bind(controller));
  app.get('/api/revenues/recurring/:id', controller.getById.bind(controller));
  app.put('/api/revenues/recurring/:id', controller.update.bind(controller));
  app.delete('/api/revenues/recurring/:id', controller.delete.bind(controller));
}
