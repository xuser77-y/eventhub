import { createApp } from './app.js';
import { env } from './config/env.js';
import { closePool } from './config/db.js';

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.log(`EventHub API listening on port ${env.PORT}`);
});

async function shutdown(signal) {
  server.close(async () => {
    await closePool();
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
