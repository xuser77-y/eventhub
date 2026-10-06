import * as participants from '../services/participant.service.js';

export async function create(request, response) { response.status(201).json({ participant: await participants.createParticipant(request.validated.body) }); }
export async function list(request, response) { response.status(200).json({ participants: await participants.listParticipants(request.validated.query.search) }); }
export async function getById(request, response) { response.status(200).json({ participant: await participants.getParticipant(request.validated.params.id) }); }
export async function update(request, response) { response.status(200).json({ participant: await participants.updateParticipant(request.validated.params.id, request.validated.body) }); }
export async function remove(request, response) { await participants.deleteParticipant(request.validated.params.id); response.status(204).send(); }
