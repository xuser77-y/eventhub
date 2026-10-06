import { getDashboard } from '../services/dashboard.service.js';
export async function get(request, response) { response.status(200).json(await getDashboard()); }
