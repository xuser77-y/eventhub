import { Router } from 'express';
import { get } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router(); router.get('/', authenticate, asyncHandler(get)); export { router };
