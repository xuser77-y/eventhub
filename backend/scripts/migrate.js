import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { closePool, getClient } from '../src/config/db.js';

const migrationPath = fileURLToPath(new URL('../migrations/001_init.sql', import.meta.url));

async function migrate() {
  const sql = await readFile(migrationPath, 'utf8');
  const client = await getClient();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration 001_init.sql completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

migrate()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(closePool);
