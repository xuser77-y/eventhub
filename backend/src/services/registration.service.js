import { getClient, query } from '../config/db.js';
import { REGISTRATION_STATUS_TRANSITIONS } from '../utils/constants.js';
import { AppError } from '../utils/AppError.js';

function toRegistration(row) {
  return { id: row.id, eventId: row.event_id, participantId: row.participant_id, status: row.status, createdAt: row.created_at, participant: { id: row.participant_id, fullName: row.participant_name, email: row.participant_email }, event: { id: row.event_id, title: row.event_title } };
}

async function getRegistration(id, executor = query) {
  const { rows } = await executor(`SELECT r.id, r.event_id, r.participant_id, r.status, r.created_at, p.full_name AS participant_name, p.email AS participant_email, e.title AS event_title FROM registrations r JOIN participants p ON p.id = r.participant_id JOIN events e ON e.id = r.event_id WHERE r.id = $1`, [id]);
  if (!rows[0]) throw new AppError(404, 'REGISTRATION_NOT_FOUND', 'Registration not found.');
  return rows[0];
}

async function assertCapacity(client, eventId, maxParticipants) {
  const { rows } = await client.query("SELECT COUNT(*)::int AS active_count FROM registrations WHERE event_id = $1 AND status IN ('pending', 'confirmed')", [eventId]);
  if (rows[0].active_count >= maxParticipants) throw new AppError(409, 'EVENT_FULL', 'Event is full.');
}

export async function createRegistration(values) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const { rows: eventRows } = await client.query('SELECT id, status, max_participants FROM events WHERE id = $1 FOR UPDATE', [values.eventId]);
    const event = eventRows[0];
    if (!event) throw new AppError(404, 'EVENT_NOT_FOUND', 'Event not found.');
    if (event.status !== 'published') throw new AppError(409, 'EVENT_NOT_PUBLISHED', 'Event is not published.');
    const { rows: participantRows } = await client.query('SELECT id FROM participants WHERE id = $1', [values.participantId]);
    if (!participantRows[0]) throw new AppError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
    const { rows: existingRows } = await client.query('SELECT id, status FROM registrations WHERE event_id = $1 AND participant_id = $2 FOR UPDATE', [values.eventId, values.participantId]);
    const existing = existingRows[0];
    if (existing && existing.status !== 'cancelled') throw new AppError(409, 'DUPLICATE_REGISTRATION', 'Participant is already registered for this event.');
    await assertCapacity(client, event.id, event.max_participants);
    let registrationId;
    if (existing) {
      const { rows } = await client.query("UPDATE registrations SET status = 'pending', created_at = NOW() WHERE id = $1 RETURNING id", [existing.id]);
      registrationId = rows[0].id;
    } else {
      const { rows } = await client.query("INSERT INTO registrations (event_id, participant_id, status) VALUES ($1, $2, 'pending') RETURNING id", [values.eventId, values.participantId]);
      registrationId = rows[0].id;
    }
    const registration = await getRegistration(registrationId, client.query.bind(client));
    await client.query('COMMIT');
    return toRegistration(registration);
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function listRegistrations(filters) {
  const values = [];
  const conditions = [];
  if (filters.eventId) { values.push(filters.eventId); conditions.push(`r.event_id = $${values.length}`); }
  if (filters.status) { values.push(filters.status); conditions.push(`r.status = $${values.length}`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await query(`SELECT r.id, r.event_id, r.participant_id, r.status, r.created_at, p.full_name AS participant_name, p.email AS participant_email, e.title AS event_title FROM registrations r JOIN participants p ON p.id = r.participant_id JOIN events e ON e.id = r.event_id ${where} ORDER BY r.created_at DESC`, values);
  return rows.map(toRegistration);
}

export async function updateRegistrationStatus(id, targetStatus) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT r.id, r.status, e.status AS event_status FROM registrations r JOIN events e ON e.id = r.event_id WHERE r.id = $1 FOR UPDATE OF r, e', [id]);
    const registration = rows[0];
    if (!registration) throw new AppError(404, 'REGISTRATION_NOT_FOUND', 'Registration not found.');
    if (!REGISTRATION_STATUS_TRANSITIONS[registration.status].includes(targetStatus)) throw new AppError(400, 'INVALID_STATUS_TRANSITION', `Cannot transition a registration from ${registration.status} to ${targetStatus}.`);
    if (targetStatus === 'confirmed' && registration.event_status !== 'published') throw new AppError(409, 'EVENT_NOT_PUBLISHED', 'Event is not published.');
    await client.query('UPDATE registrations SET status = $1 WHERE id = $2', [targetStatus, id]);
    const updated = await getRegistration(id, client.query.bind(client));
    await client.query('COMMIT');
    return toRegistration(updated);
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}
