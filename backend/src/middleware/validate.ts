import { RequestHandler } from 'express';
import { ZodError, ZodType } from 'zod';
import { badRequest } from '../errors/AppError';

type RequestTarget = 'body' | 'query' | 'params';

function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));
}

function validate(target: RequestTarget, schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return next(badRequest('Validation failed', formatZodError(result.error)));
    }

    if (target === 'body') {
      req.body = result.data;
    } else if (target === 'query') {
      req.query = result.data as typeof req.query;
    } else {
      req.params = result.data as typeof req.params;
    }

    next();
  };
}

export function validateBody(schema: ZodType): RequestHandler {
  return validate('body', schema);
}

export function validateQuery(schema: ZodType): RequestHandler {
  return validate('query', schema);
}

export function validateParams(schema: ZodType): RequestHandler {
  return validate('params', schema);
}
