import { getClient, query } from '../config/db.js';
import { EVENT_STATUS_TRANSITIONS } from '../utils/constants.js';
import { AppError } from '../utils/AppError.js';

const eventColumns = `
  e.id,
  e.title,
  e.description,
  e.location,
  e.event_date,
  e.max_participants,
  e.status,
  e.created_by,
  e.created_at,
  e.updated_at,
  COUNT(r.id) FILTER (WHERE r.status IN ('pending', 'confirmed'))::int AS registered_count`;

const eventGroupBy = `
  e.id, e.title, e.description, e.location, e.event_date,
  e.max_participants, e.status, e.created_by, e.created_at, e.updated_at`;

function toEvent(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.event_date,
    maxParticipants: row.max_participants,
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    registeredCount: row.registered_count
  };
}

async function findEventById(id, executor = query) {
  const { rows } = await executor(
    `SELECT ${eventColumns}
     FROM events e
     LEFT JOIN registrations r ON r.event_id = e.id
     WHERE e.id = $1
     GROUP BY ${eventGroupBy}`,
    [id]
  );

  if (!rows[0]) {
    throw new AppError(404, 'EVENT_NOT_FOUND', 'Event not found.');
  }

  return rows[0];
}

export async function createEvent(values, userId) {
  const { rows } = await query(
    `INSERT INTO events (title, description, location, event_date, max_participants, status, created_by)
     VALUES ($1, $2, $3, $4, $5, 'draft', $6)
     RETURNING id`,
    [values.title, values.description, values.location, values.eventDate, values.maxParticipants, userId]
  );

  return toEvent(await findEventById(rows[0].id));
}

export async function listEvents(filters) {
  const values = [];
  const conditions = [];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`e.status = $${values.length}`);
  }

  if (filters.date) {
    values.push(filters.date);
    conditions.push(`e.event_date >= $${values.length}::date`);
    conditions.push(`e.event_date < $${values.length}::date + INTERVAL '1 day'`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT ${eventColumns}
     FROM events e
     LEFT JOIN registrations r ON r.event_id = e.id
     ${whereClause}
     GROUP BY ${eventGroupBy}
     ORDER BY e.event_date ASC`,
    values
  );

  return rows.map(toEvent);
}

export async function getEvent(id) {
  return toEvent(await findEventById(id));
}

export async function updateEvent(id, values) {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT id, status FROM events WHERE id = $1 FOR UPDATE', [id]);
    const event = rows[0];

    if (!event) {
      throw new AppError(404, 'EVENT_NOT_FOUND', 'Event not found.');
    }
    if (event.status === 'cancelled') {
      throw new AppError(409, 'EVENT_CANCELLED', 'Cancelled events cannot be edited.');
    }

    if (values.maxParticipants !== undefined) {
      const { rows: countRows } = await client.query(
        `SELECT COUNT(*)::int AS active_count
         FROM registrations
         WHERE event_id = $1 AND status IN ('pending', 'confirmed')`,
        [id]
      );
      if (values.maxParticipants < countRows[0].active_count) {
        throw new AppError(409, 'CAPACITY_BELOW_REGISTRATIONS', 'Maximum participants cannot be below the active registration count.');
      }
    }

    const columnMap = {
      title: 'title',
      description: 'description',
      location: 'location',
      eventDate: 'event_date',
      maxParticipants: 'max_participants'
    };
    const assignments = [];
    const parameters = [];

    for (const [field, column] of Object.entries(columnMap)) {
      if (values[field] !== undefined) {
        parameters.push(values[field]);
        assignments.push(`${column} = $${parameters.length}`);
      }
    }

    parameters.push(id);
    await client.query(
      `UPDATE events
       SET ${assignments.join(', ')}, updated_at = NOW()
       WHERE id = $${parameters.length}`,
      parameters
    );
    const updated = await findEventById(id, client.query.bind(client));
    await client.query('COMMIT');
    return toEvent(updated);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function updateEventStatus(id, targetStatus) {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT id, status FROM events WHERE id = $1 FOR UPDATE', [id]);
    const event = rows[0];

    if (!event) {
      throw new AppError(404, 'EVENT_NOT_FOUND', 'Event not found.');
    }
    if (!EVENT_STATUS_TRANSITIONS[event.status].includes(targetStatus)) {
      throw new AppError(400, 'INVALID_STATUS_TRANSITION', `Cannot transition an event from ${event.status} to ${targetStatus}.`);
    }

    await client.query('UPDATE events SET status = $1, updated_at = NOW() WHERE id = $2', [targetStatus, id]);
    if (targetStatus === 'cancelled') {
      await client.query("UPDATE registrations SET status = 'cancelled' WHERE event_id = $1", [id]);
    }

    const updated = await findEventById(id, client.query.bind(client));
    await client.query('COMMIT');
    return toEvent(updated);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
