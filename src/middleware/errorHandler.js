import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`Error - ${err.name}: ${err.message}`);

  res.status(err.status || 500).json({
    status: "error",
    error: err.name || "Error interno del servidor.",
    message: err.message || "Error inesperado.",
  });
};
