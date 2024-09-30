import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Cấu hình winston
const log = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
    }),
  ],
});

export function logger(req: Request, res: Response, next: NextFunction) {
  log.info(
    `${req.method} ${req.path} Queries: ${JSON.stringify(req.query)} - Params: ${JSON.stringify(req.params)} - Body: ${JSON.stringify(req.body)}`,
  );

  next();
}
