import { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../errors/AppError';
import type { ErrorResponse } from '../types';

function formatMongooseValidationError(
  error: mongoose.Error.ValidationError
): ErrorResponse {
  const details = Object.values(error.errors).map((err) => ({
    field: err.path,
    message: err.message,
  }));

  return {
    error: 'Validation failed',
    details,
  };
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    const body: ErrorResponse = { error: err.message };
    if (err.details?.length) {
      body.details = err.details;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json(formatMongooseValidationError(err));
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
