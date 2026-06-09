import { useApiStore } from '../stores/apiStore';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_URL = import.meta.env.VITE_API_URL || '';
const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [5_000, 10_000, 15_000];
const REQUEST_TIMEOUT_MS = 90_000;

export function getApiUrl(): string {
  return API_URL;
}

function buildUrl(path: string): string {
  return `${API_URL}${path}`;
}

function isRetryableStatus(status: number): boolean {
  return status === 502 || status === 503 || status === 504;
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError) return isRetryableStatus(error.status);
  if (error instanceof TypeError) return true;
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(error.message || 'Request failed', res.status);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

export interface ApiFetchOptions extends RequestInit {
  token?: string | null;
  retries?: number;
  timeoutMs?: number;
  skipWakeIndicator?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const {
    token,
    retries = MAX_RETRIES,
    timeoutMs = REQUEST_TIMEOUT_MS,
    skipWakeIndicator = false,
    headers,
    ...fetchOptions
  } = options;

  const url = buildUrl(path);
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0 && !skipWakeIndicator) {
      useApiStore.getState().setWakingUp(true, attempt);
      await sleep(RETRY_DELAYS_MS[attempt - 1] ?? RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]);
    }

    try {
      const res = await fetchWithTimeout(
        url,
        { ...fetchOptions, headers: requestHeaders },
        timeoutMs,
      );
      const result = await parseResponse<T>(res);
      if (!skipWakeIndicator) {
        useApiStore.getState().setWakingUp(false, 0);
      }
      return result;
    } catch (error) {
      lastError = error;
      const canRetry = attempt < retries && isRetryableError(error);
      if (!canRetry) break;
    }
  }

  if (!skipWakeIndicator) {
    useApiStore.getState().setWakingUp(false, 0);
  }

  if (lastError instanceof ApiError) throw lastError;
  if (lastError instanceof DOMException && lastError.name === 'AbortError') {
    throw new Error('O servidor demorou para responder. Tente novamente em instantes.');
  }
  if (lastError instanceof TypeError) {
    throw new Error('Não foi possível conectar ao servidor. Ele pode estar iniciando — aguarde e tente novamente.');
  }
  throw lastError instanceof Error ? lastError : new Error('Erro inesperado na requisição');
}

export async function wakeServer(): Promise<boolean> {
  try {
    await apiFetch<{ status: string }>('/api/health', {
      method: 'GET',
      skipWakeIndicator: true,
      retries: MAX_RETRIES,
    });
    return true;
  } catch {
    return false;
  }
}

export function getColdStartMessage(): string {
  return 'O servidor está iniciando. Isso pode levar até 1 minuto no plano gratuito.';
}

export function isColdStartError(message: string): boolean {
  return (
    message.includes('iniciando') ||
    message.includes('conectar ao servidor') ||
    message.includes('demorou para responder')
  );
}
