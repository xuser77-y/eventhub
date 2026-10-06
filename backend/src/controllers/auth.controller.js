import { getUserById, login } from '../services/auth.service.js';

export async function loginUser(request, response) {
  const result = await login(request.validated.body.email, request.validated.body.password);
  response.status(200).json(result);
}

export async function getCurrentUser(request, response) {
  const user = await getUserById(request.user.id);
  response.status(200).json({ user });
}
