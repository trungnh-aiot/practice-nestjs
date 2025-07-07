import { format, LoggerOptions, transports } from 'winston';

export const winstonConfig: LoggerOptions = {
  level: 'info',
  transports: [
    new transports.File({
      filename: `logs/error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: `logs/combined.log`,
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.cli(),
        format.splat(),
        format.printf((info) => {
          const level = typeof info.level === 'string' ? info.level : 'UNKNOWN';
          const message =
            typeof info.message === 'string'
              ? info.message
              : JSON.stringify(info.message);
          const timestamp =
            typeof info.timestamp === 'string' ? info.timestamp : '';

          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  ],
};
