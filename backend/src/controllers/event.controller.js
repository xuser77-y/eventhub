import {
  createEvent,
  getEvent,
  listEvents,
  updateEvent,
  updateEventStatus
} from '../services/event.service.js';

export async function create(request, response) {
  const event = await createEvent(request.validated.body, request.user.id);
  response.status(201).json({ event });
}

export async function list(request, response) {
  const events = await listEvents(request.validated.query);
  response.status(200).json({ events });
}

export async function getById(request, response) {
  const event = await getEvent(request.validated.params.id);
  response.status(200).json({ event });
}

export async function update(request, response) {
  const event = await updateEvent(request.validated.params.id, request.validated.body);
  response.status(200).json({ event });
}

export async function updateStatus(request, response) {
  const event = await updateEventStatus(request.validated.params.id, request.validated.body.status);
  response.status(200).json({ event });
}
