import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
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

@Injectable()
export class loggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, path, query, params, body } = request;
    const { statusCode } = response;
    log.info(
      `${method} ${path} Queries: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)} - Body: ${JSON.stringify(body)} - Response: ${statusCode}`,
    );
    return next.handle();
  }
}
