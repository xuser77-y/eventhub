import { Router } from 'express';
import * as controller from '../controllers/participant.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createParticipantSchema, participantIdSchema, participantListQuerySchema, updateParticipantSchema } from '../validators/participant.validator.js';

const router = Router();
router.use(authenticate);
router.post('/', validate({ body: createParticipantSchema }), asyncHandler(controller.create));
router.get('/', validate({ query: participantListQuerySchema }), asyncHandler(controller.list));
router.get('/:id', validate({ params: participantIdSchema }), asyncHandler(controller.getById));
router.put('/:id', validate({ params: participantIdSchema, body: updateParticipantSchema }), asyncHandler(controller.update));
router.delete('/:id', validate({ params: participantIdSchema }), asyncHandler(controller.remove));
export { router };
