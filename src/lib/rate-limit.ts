import { RateLimitError } from '@/utils/errors';
import logger from '@/utils/logger';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
let requestCount = 0;

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Max requests per window
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): void {
  const { windowMs = 15 * 60 * 1000, maxRequests = 100 } = options;
  const now = Date.now();

  // Lazy cleanup of the entire store every 100 checks to prevent memory leaks in serverless runtimes
  requestCount++;
  if (requestCount >= 100) {
    requestCount = 0;
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }

  // Warning for production scale
  if (process.env.NODE_ENV === 'production' && rateLimitStore.size > 10000) {
    logger.warn('Rate limit store is large. Consider migrating to Redis/Upstash for production deployments.');
  }

  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return;
  }

  entry.count++;

  if (entry.count > maxRequests) {
    throw new RateLimitError();
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}
