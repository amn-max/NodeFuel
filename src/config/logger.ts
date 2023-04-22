import winston from "winston";

const logger = winston.createLogger({
  level: "info", // set the level of logging to "info" or higher
  format: winston.format.json(), // format logs in JSON
  transports: [
    // Define two transports:
    // 1. Write logs with "error" level or higher to "error.log" file
    // 2. Write all logs with level "info" and below to "combined.log" file
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// If the environment is not in production, also log to console with the following format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest })
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Export a "stream" object that can be used to write logs to the logger instance
export const stream = {
  write: (message: any) => {
    logger.info(message);
  },
};

export default logger;
