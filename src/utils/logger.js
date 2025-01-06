import { createLogger, format, transports } from 'winston';
import fs from 'fs';

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

class Logger {
    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                colorize(),
                customFormat
            ),
            transports: [
                new transports.File({ filename: 'log/app.log' })
            ],
            exceptionHandlers: [
                new transports.File({ filename: 'log/exceptions.log' })
            ],
            rejectionHandlers: [
                new transports.File({ filename: 'log/rejections.log' })
            ]
        });
    }

    info(message) {
        this.logger.info(message);
    }

    warn(message) {
        this.logger.warn(message);
    }

    error(message) {
        this.logger.error(message);
    }

    debug(message) {
        this.logger.debug(message);
    }

    setLevel(level) {
        this.logger.level = level;
    }

    clear() {
        fs.truncate('log/app.log', 0, (err) => {
            if (err) {
                this.logger.error('Failed to clear the log file: ' + err.message);
            } else {
                this.logger.info('Log file cleared');
            }
        });
    }

    showSkelLogo() {
        console.log(`
          __  __            __   
         / / / /___  ____  / /__ 
        / /_/ / __ \\/ __ \\/ / _ \\
       / __  / /_/ / /_/ / /  __/
      /_/ /_/\\____/ .___/_/\\___/ 
                 /_/             
        `);
    }
}

const logger = new Logger();
export default logger;
