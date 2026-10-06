import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/AppError.js';

function rateLimitHandler(request, response, next) {
  next(new AppError(429, 'RATE_LIMITED', 'Too many requests. Please try again later.'));
}

const commonOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler
};

export const apiRateLimiter = rateLimit({
  ...commonOptions,
  max: 300
});

export const loginRateLimiter = rateLimit({
  ...commonOptions,
  max: 10
});
