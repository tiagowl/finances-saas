import type { FastifyCorsOptions } from '@fastify/cors';

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '');
}

export function parseCorsOrigins(raw?: string): string[] {
  if (!raw?.trim()) {
    return ['http://localhost:5173'];
  }

  return raw
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);
}

export function buildCorsOptions(): FastifyCorsOptions {
  const allowedOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);

  return {
    origin: (origin, callback) => {
      // Same-origin tools (curl, health checks) may omit Origin
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalized)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
}
