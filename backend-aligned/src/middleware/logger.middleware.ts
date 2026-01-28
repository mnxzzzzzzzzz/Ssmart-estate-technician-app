// Request Logger Middleware

import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { config } from '../config/env';

// Create Winston logger
const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      ),
    }),
  ],
});

// Add file transport in production
if (config.nodeEnv === 'production') {
  logger.add(
    new winston.transports.File({
      filename: config.logFile,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};

// Export logger for use in other modules
export { logger };
