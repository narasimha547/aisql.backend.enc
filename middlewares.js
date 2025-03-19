const helmet = require("helmet");
const xss = require("xss-clean");
const { body, validationResult } = require("express-validator");
const express = require("express");
const winston = require("winston");

const app = express();

// Security middleware
app.use(helmet());
app.use(xss());
app.use(express.json());

// Logger configuration using Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/requests.log" }),
    // new winston.transports.File({ filename: path.join(LOG_PATH, "requests.log") }),
    new winston.transports.Console(),
  ],
});

// Middleware to log requests & responses
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${duration} ms`,
      requestBody: req.body,
      responseBody: res.locals.responseData || null,
    });
  });

  // Capture response data
  const originalSend = res.send;
  res.send = function (body) {
    res.locals.responseData = body;
    originalSend.call(this, body);
  };

  next();
});

// Global request validation middleware
const validateRequest = [
  body("inputField").trim().escape(), // Sanitize input
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed to the next middleware/route
  },
];

module.exports = { validateRequest, logger };
