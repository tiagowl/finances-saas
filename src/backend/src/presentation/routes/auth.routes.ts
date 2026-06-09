import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller.js';

export function registerAuthRoutes(
  app: FastifyInstance,
  controller: AuthController,
) {
  app.post('/api/auth/register', controller.register.bind(controller));
  app.post('/api/auth/login', controller.login.bind(controller));
  app.put('/api/auth/profile', controller.updateProfile.bind(controller));
}
