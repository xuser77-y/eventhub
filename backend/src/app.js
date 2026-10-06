import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { apiRateLimiter } from './middlewares/rateLimiters.js';
import { router } from './routes/index.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: '10kb' }));
  app.use('/api', apiRateLimiter);
  app.use('/api', router);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
