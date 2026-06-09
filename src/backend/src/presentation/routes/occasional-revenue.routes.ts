import { FastifyInstance } from 'fastify';
import { OccasionalRevenueController } from '../controllers/occasional-revenue.controller.js';

export function registerOccasionalRevenueRoutes(
  app: FastifyInstance,
  controller: OccasionalRevenueController,
) {
  app.post('/api/revenues/occasional', controller.create.bind(controller));
  app.get('/api/revenues/occasional', controller.list.bind(controller));
  app.get('/api/revenues/occasional/total', controller.total.bind(controller));
  app.get('/api/revenues/occasional/:id', controller.getById.bind(controller));
  app.put('/api/revenues/occasional/:id', controller.update.bind(controller));
  app.delete('/api/revenues/occasional/:id', controller.delete.bind(controller));
}
