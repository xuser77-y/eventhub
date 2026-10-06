import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

export function query(text, parameters) {
  return pool.query(text, parameters);
}

export function getClient() {
  return pool.connect();
}

export function closePool() {
  return pool.end();
}
