import app from "./app.js";
import { logger } from "./utils/logger.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8080;

const conexion = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("Conexión exitosa con Mongo Atlas"))
  .catch((err) => logger.error("Error de conexión con MongoDB", err));

app.listen(PORT, () => logger.info(`Servidor escuchando en el puerto ${PORT}`));
