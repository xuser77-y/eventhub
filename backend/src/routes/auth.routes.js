import { Router } from 'express';
import { getCurrentUser, loginUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { loginRateLimiter } from '../middlewares/rateLimiters.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', loginRateLimiter, validate({ body: loginSchema }), asyncHandler(loginUser));
router.get('/me', authenticate, asyncHandler(getCurrentUser));

export { router };
