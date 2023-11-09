import { createLogger, format, transports } from 'winston';

const webappLogger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: 'webapp.log',
    }),
  ],
});

export default webappLogger;