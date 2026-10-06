import { query } from '../config/db.js';

export async function getDashboard() {
  const { rows: summaryRows } = await query(`SELECT COUNT(*)::int AS total_events, COUNT(*) FILTER (WHERE status = 'published')::int AS published_events FROM events`);
  const { rows: todayRows } = await query(`SELECT COUNT(*)::int AS registrations_today FROM registrations WHERE created_at::date = CURRENT_DATE`);
  const { rows: topRows } = await query(`SELECT e.id, e.title, e.max_participants, COUNT(r.id) FILTER (WHERE r.status IN ('pending', 'confirmed'))::int AS registered FROM events e LEFT JOIN registrations r ON r.event_id = e.id WHERE e.status = 'published' GROUP BY e.id ORDER BY (COUNT(r.id) FILTER (WHERE r.status IN ('pending', 'confirmed')))::numeric / e.max_participants DESC, COUNT(r.id) FILTER (WHERE r.status IN ('pending', 'confirmed')) DESC LIMIT 5`);
  return { totalEvents: summaryRows[0].total_events, publishedEvents: summaryRows[0].published_events, registrationsToday: todayRows[0].registrations_today, topEvents: topRows.map((row) => ({ id: row.id, title: row.title, maxParticipants: row.max_participants, registered: row.registered, fillRate: Number(row.registered) / row.max_participants })) };
}
