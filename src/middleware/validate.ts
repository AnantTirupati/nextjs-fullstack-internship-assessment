import { z } from 'zod';
import { ValidationError } from '@/utils/errors';

export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map(
      (err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`
    );
    throw new ValidationError('Validation failed', errors);
  }

  return result.data;
}

export function validateQuery<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.issues.map(
      (err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`
    );
    throw new ValidationError('Invalid query parameters', errors);
  }

  return result.data;
}
