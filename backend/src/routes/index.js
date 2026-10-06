import { Router } from 'express';
import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { router as authRouter } from './auth.routes.js';

const router = Router();

router.get('/health', asyncHandler(async (request, response) => {
  await query('SELECT 1');
  response.status(200).json({ status: 'ok' });
}));

router.use('/auth', authRouter);

export { router };
