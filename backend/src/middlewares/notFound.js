import { AppError } from '../utils/AppError.js';

export function notFound(request, response, next) {
  next(new AppError(404, 'NOT_FOUND', `Route ${request.method} ${request.originalUrl} was not found.`));
}
