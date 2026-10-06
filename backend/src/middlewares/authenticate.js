import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { getUserById } from '../services/auth.service.js';
import { AppError } from '../utils/AppError.js';

export async function authenticate(request, response, next) {
  const authorization = request.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return next(new AppError(401, 'AUTHENTICATION_FAILED', 'Authentication is required.'));
  }

  try {
    const token = authorization.slice('Bearer '.length);
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload !== 'object' || typeof payload.sub !== 'string') {
      throw new AppError(401, 'AUTHENTICATION_FAILED', 'Authentication is required.');
    }

    request.user = await getUserById(payload.sub);
    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(401, 'AUTHENTICATION_FAILED', 'Authentication is required.'));
  }
}
