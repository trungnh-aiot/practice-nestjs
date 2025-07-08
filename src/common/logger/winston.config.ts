import { format, LoggerOptions, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const winstonConfig: LoggerOptions = {
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // log stack trace nếu có
    format.splat(),
    format.json(),
  ),
  transports: [
    new DailyRotateFile({
      level: 'error',
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d',
    }),

    new DailyRotateFile({
      dirname: 'logs',
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d',
    }),

    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.cli(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${typeof message === 'string' ? message : JSON.stringify(message)}`;
        }),
      ),
    }),
  ],
};
