import { FastifyInstance } from 'fastify';
import { IUserRepository } from '../application/ports/repositories/IUserRepository.js';

export function registerAccessLogHook(
  app: FastifyInstance,
  userRepo: IUserRepository,
) {
  app.addHook('onResponse', async (request, reply) => {
    if (request.url.startsWith('/api/auth') || request.url === '/api/health') return;
    if (request.method !== 'GET' && request.method !== 'POST' && request.method !== 'PUT' && request.method !== 'DELETE') return;

    try {
      const user = request.user as { id: string } | undefined;
      if (!user?.id) return;

      const url = new URL(request.url, 'http://localhost');
      const page = url.pathname;
      let action = request.method;

      if (request.method === 'POST') action = 'create';
      else if (request.method === 'PUT') action = 'update';
      else if (request.method === 'DELETE') action = 'delete';
      else if (request.method === 'GET') action = 'view';

      const status = reply.statusCode >= 200 && reply.statusCode < 300 ? 'success' : 'error';

      const userAgent = (request.headers['user-agent'] as string) || null;

      const errorDetails = (request as any).__errorDetails as { message: string } | undefined;
      const errorMessage = status === 'error' ? (errorDetails?.message || `HTTP ${reply.statusCode}`) : null;

      await userRepo.saveAccessLog(
        user.id,
        action,
        page,
        request.ip,
        status,
        userAgent,
        errorMessage,
      );
    } catch {
      // Silently fail - logging should never break the app
    }
  });
}
