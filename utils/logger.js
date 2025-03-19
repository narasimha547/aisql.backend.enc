const winston = require("winston");
require("winston-daily-rotate-file");

const LOGGING_ENABLED = process.env.LOGGING_ENABLED === true; // Convert to boolean

// Configure log file rotation only if logging is enabled
const transports = [];
if (LOGGING_ENABLED) {
  transports.push(
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: "logs/app-%DATE%.log", // Log file pattern
      datePattern: "YYYY-MM-DD", // Log rotation daily
      zippedArchive: true, // Compress old logs
      maxSize: "20m", // Max file size before rotation
      maxFiles: "14d", // Keep logs for 14 days
    })
  );
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: transports, // Only add transports if logging is enabled
});

// If logging is disabled, use a no-op function
if (!LOGGING_ENABLED) {
  logger.info = () => {};
  logger.warn = () => {};
  logger.error = () => {};
  logger.debug = () => {};
}

module.exports = logger;
