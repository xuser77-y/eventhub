import { query } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

function toParticipant(row) {
  return { id: row.id, fullName: row.full_name, email: row.email, phone: row.phone, createdAt: row.created_at };
}

function duplicateEmail(error) {
  return error.code === '23505' && error.constraint === 'participants_email_key';
}

export async function createParticipant(values) {
  try {
    const { rows } = await query(
      'INSERT INTO participants (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [values.fullName, values.email, values.phone]
    );
    return toParticipant(rows[0]);
  } catch (error) {
    if (duplicateEmail(error)) throw new AppError(409, 'DUPLICATE_EMAIL', 'A participant with this email already exists.');
    throw error;
  }
}

export async function listParticipants(search) {
  const parameters = [];
  let where = '';
  if (search) {
    parameters.push(`%${search.toLowerCase()}%`);
    where = 'WHERE full_name ILIKE $1 OR email ILIKE $1';
  }
  const { rows } = await query(`SELECT * FROM participants ${where} ORDER BY full_name ASC`, parameters);
  return rows.map(toParticipant);
}

export async function getParticipant(id) {
  const { rows } = await query('SELECT * FROM participants WHERE id = $1', [id]);
  if (!rows[0]) throw new AppError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  return toParticipant(rows[0]);
}

export async function updateParticipant(id, values) {
  const fields = { fullName: 'full_name', email: 'email', phone: 'phone' };
  const assignments = [];
  const parameters = [];
  for (const [field, column] of Object.entries(fields)) {
    if (values[field] !== undefined) {
      parameters.push(values[field]);
      assignments.push(`${column} = $${parameters.length}`);
    }
  }
  parameters.push(id);
  try {
    const { rows } = await query(`UPDATE participants SET ${assignments.join(', ')} WHERE id = $${parameters.length} RETURNING *`, parameters);
    if (!rows[0]) throw new AppError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
    return toParticipant(rows[0]);
  } catch (error) {
    if (duplicateEmail(error)) throw new AppError(409, 'DUPLICATE_EMAIL', 'A participant with this email already exists.');
    throw error;
  }
}

export async function deleteParticipant(id) {
  const { rowCount } = await query('DELETE FROM participants WHERE id = $1', [id]);
  if (rowCount === 0) throw new AppError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
}
