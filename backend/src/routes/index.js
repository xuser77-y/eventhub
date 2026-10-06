import { Router } from 'express';
import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/health', asyncHandler(async (request, response) => {
  await query('SELECT 1');
  response.status(200).json({ status: 'ok' });
}));

export { router };
