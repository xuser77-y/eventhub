import * as registrations from '../services/registration.service.js';
export async function create(request, response) { response.status(201).json({ registration: await registrations.createRegistration(request.validated.body) }); }
export async function list(request, response) { response.status(200).json({ registrations: await registrations.listRegistrations(request.validated.query) }); }
export async function updateStatus(request, response) { response.status(200).json({ registration: await registrations.updateRegistrationStatus(request.validated.params.id, request.validated.body.status) }); }
