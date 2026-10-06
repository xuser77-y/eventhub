import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  const knownError = error instanceof AppError;
  const statusCode = knownError ? error.statusCode : 500;
  const code = knownError ? error.code : 'INTERNAL_ERROR';
  const message = knownError ? error.message : 'An unexpected error occurred.';

  if (!knownError && env.NODE_ENV !== 'test') {
    console.error(error);
  }

  return response.status(statusCode).json({
    error: {
      code,
      message,
      ...(error.details !== undefined ? { details: error.details } : {})
    }
  });
}
