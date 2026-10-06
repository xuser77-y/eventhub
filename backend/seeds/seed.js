import bcrypt from 'bcrypt';
import { env } from '../src/config/env.js';
import { closePool, getClient } from '../src/config/db.js';

const password = 'EventHub2025!';

const participants = [
  ['Amine El Mansouri', 'amine.elmansouri@example.ma', '+212 661 123 456'],
  ['Leila El Fassi', 'leila.elfassi@example.ma', '+212 662 234 567'],
  ['Yassine Tazi', 'yassine.tazi@example.ma', '+212 663 345 678'],
  ['Salma Bennani', 'salma.bennani@example.ma', '+212 664 456 789'],
  ['Mehdi Chraibi', 'mehdi.chraibi@example.ma', '+212 665 567 890'],
  ['Sophie Laurent', 'sophie.laurent@example.fr', '+33 6 12 34 56 78'],
  ['David Okafor', 'david.okafor@example.ng', '+234 803 123 4567'],
  ['Nora Williams', 'nora.williams@example.com', '+1 415 555 0142'],
  ['Omar Ait Lahcen', 'omar.aitlahcen@example.ma', '+212 666 678 901'],
  ['Amina Diallo', 'amina.diallo@example.sn', '+221 77 123 45 67']
];

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString();
}

async function insertUser(client, fullName, email, role, passwordHash) {
  const { rows } = await client.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [fullName, email, passwordHash, role]
  );
  return rows[0].id;
}

async function seed() {
  const client = await getClient();
  const now = new Date();

  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE registrations, events, participants, users RESTART IDENTITY CASCADE');

    const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
    const adminId = await insertUser(client, 'Kenza Benjelloun', 'kenza.benjelloun@eventhub.ma', 'admin', passwordHash);
    const staffId = await insertUser(client, 'Rachid El Idrissi', 'rachid.elidrissi@eventhub.ma', 'staff', passwordHash);

    const eventDefinitions = [
      ['tech', 'Casablanca Tech Summit', 'A two-day summit for technology leaders and builders.', 'Hyatt Regency Casablanca', addDays(now, 14), 5, 'published', adminId],
      ['design', 'Contemporary Moroccan Design Workshop', 'Hands-on workshop exploring contemporary Moroccan design.', 'Villa des Arts, Casablanca', addDays(now, 21), 8, 'published', staffId],
      ['literature', 'Fes Literary Forum', 'A forthcoming literary forum with regional authors.', 'Riad Fes', addDays(now, 35), 60, 'draft', adminId],
      ['food', 'Tangier Culinary Heritage Evening', 'An evening celebrating northern Moroccan culinary traditions.', 'Dar Sultan, Tangier', addDays(now, -7), 30, 'cancelled', staffId],
      ['music', 'Rabat Acoustic Sessions', 'An intimate live music programme in Rabat.', 'Chellah Ruins, Rabat', addDays(now, 28), 12, 'published', adminId]
    ];

    const events = {};
    for (const [key, title, description, location, eventDate, maxParticipants, status, createdBy] of eventDefinitions) {
      const { rows } = await client.query(
        `INSERT INTO events (title, description, location, event_date, max_participants, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [title, description, location, eventDate, maxParticipants, status, createdBy]
      );
      events[key] = rows[0].id;
    }

    const participantIds = [];
    for (const [fullName, email, phone] of participants) {
      const { rows } = await client.query(
        `INSERT INTO participants (full_name, email, phone)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [fullName, email, phone]
      );
      participantIds.push(rows[0].id);
    }

    const registrations = [
      ['tech', 0, 'confirmed', addDays(now, -2)], ['tech', 1, 'confirmed', addDays(now, -1)],
      ['tech', 2, 'confirmed', now.toISOString()], ['tech', 3, 'pending', now.toISOString()], ['tech', 4, 'pending', addDays(now, -3)],
      ['design', 0, 'confirmed', addDays(now, -4)], ['design', 1, 'pending', now.toISOString()],
      ['design', 5, 'confirmed', addDays(now, -2)], ['design', 6, 'pending', addDays(now, -1)], ['design', 7, 'confirmed', addDays(now, -5)],
      ['food', 2, 'cancelled', addDays(now, -12)], ['food', 3, 'cancelled', addDays(now, -12)],
      ['food', 4, 'cancelled', addDays(now, -11)], ['food', 5, 'cancelled', addDays(now, -10)],
      ['music', 0, 'confirmed', addDays(now, -2)], ['music', 1, 'pending', now.toISOString()],
      ['music', 2, 'confirmed', addDays(now, -3)], ['music', 3, 'pending', addDays(now, -1)],
      ['music', 8, 'pending', addDays(now, -4)], ['music', 9, 'cancelled', addDays(now, -5)]
    ];

    for (const [eventKey, participantIndex, status, createdAt] of registrations) {
      await client.query(
        `INSERT INTO registrations (event_id, participant_id, status, created_at)
         VALUES ($1, $2, $3, $4)`,
        [events[eventKey], participantIds[participantIndex], status, createdAt]
      );
    }

    await client.query('COMMIT');
    console.log('Seed completed successfully.');
    console.log('Admin: kenza.benjelloun@eventhub.ma / EventHub2025!');
    console.log('Staff: rachid.elidrissi@eventhub.ma / EventHub2025!');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(closePool);
