import { FastifyInstance } from 'fastify';
import { CategoryController } from '../controllers/category.controller.js';

export function registerCategoryRoutes(
  app: FastifyInstance,
  controller: CategoryController,
) {
  app.post('/api/categories', controller.create.bind(controller));
  app.get('/api/categories', controller.list.bind(controller));
  app.get('/api/categories/:id', controller.getById.bind(controller));
  app.put('/api/categories/:id', controller.update.bind(controller));
  app.delete('/api/categories/:id', controller.delete.bind(controller));
}
