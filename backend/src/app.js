import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { router } from './routes/index.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));
  app.use('/api', router);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
