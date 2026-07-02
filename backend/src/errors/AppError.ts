import type { ErrorDetail } from '../types';

export class AppError extends Error {
  readonly statusCode: number;
  readonly details?: ErrorDetail[];

  constructor(statusCode: number, message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function badRequest(message: string, details?: ErrorDetail[]): AppError {
  return new AppError(400, message, details);
}

export function notFound(message: string): AppError {
  return new AppError(404, message);
}

export function conflict(message: string): AppError {
  return new AppError(409, message);
}

export function internalError(message = 'Internal server error'): AppError {
  return new AppError(500, message);
}
