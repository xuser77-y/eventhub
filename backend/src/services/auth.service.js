import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

function toPublicUser(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at
  };
}

export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const { rows } = await query(
    `SELECT id, full_name, email, password_hash, role, created_at
     FROM users
     WHERE email = $1`,
    [normalizedEmail]
  );
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError(401, 'AUTHENTICATION_FAILED', 'Invalid credentials.');
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });

  return { token, user: toPublicUser(user) };
}

export async function getUserById(id) {
  const { rows } = await query(
    `SELECT id, full_name, email, role, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  if (!rows[0]) {
    throw new AppError(401, 'AUTHENTICATION_FAILED', 'Authentication is required.');
  }

  return toPublicUser(rows[0]);
}
