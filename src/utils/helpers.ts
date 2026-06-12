import { NextResponse } from 'next/server';
import { AppError } from './errors';
import logger from './logger';

export function successResponse<T>(
  data: T,
  message: string = 'Operation successful',
  status: number = 200,
  meta?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...(meta ? { pagination: meta } : {}),
    },
    { status }
  );
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errors: error.errors,
      },
      { status: error.statusCode }
    );
  }

  logger.error('Unhandled error:', error);

  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
      errors: [],
    },
    { status: 500 }
  );
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(sanitized[key] as string);
    }
  }
  return sanitized;
}
