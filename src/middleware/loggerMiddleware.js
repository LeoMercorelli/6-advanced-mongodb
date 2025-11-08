import { logger } from "../utils/logger.js";

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `Solicitud ${req.method} ${req.url} - ${new Date().toISOString()}`
  );
  next();
};
