import { config } from './config';
import { connectDB } from './config/database';
import { createApp } from './app';
import { logger } from './utils/logger';

const start = async (): Promise<void> => {
  await connectDB();

  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    logger.info(`Swagger UI: http://localhost:${config.port}/api-docs`);
  });

  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}. Graceful shutdown initiated...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection', { reason });
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error });
    server.close(() => process.exit(1));
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
