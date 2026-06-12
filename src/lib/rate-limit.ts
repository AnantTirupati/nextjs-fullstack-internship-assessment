import { RateLimitError } from '@/utils/errors';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

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
