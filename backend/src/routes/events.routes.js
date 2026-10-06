import { Router } from 'express';
import {
  create,
  getById,
  list,
  update,
  updateStatus
} from '../controllers/event.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createEventSchema,
  eventIdSchema,
  eventListQuerySchema,
  eventStatusSchema,
  updateEventSchema
} from '../validators/event.validator.js';

const router = Router();

router.use(authenticate);
router.post('/', validate({ body: createEventSchema }), asyncHandler(create));
router.get('/', validate({ query: eventListQuerySchema }), asyncHandler(list));
router.get('/:id', validate({ params: eventIdSchema }), asyncHandler(getById));
router.put('/:id', validate({ params: eventIdSchema, body: updateEventSchema }), asyncHandler(update));
router.patch('/:id/status', validate({ params: eventIdSchema, body: eventStatusSchema }), asyncHandler(updateStatus));

export { router };
