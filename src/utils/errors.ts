export class AppError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors: string[];

  constructor(message: string, statusCode: number, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', errors: string[] = []) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, 429);
  }
}
