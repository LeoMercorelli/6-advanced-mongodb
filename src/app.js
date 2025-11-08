import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import mockingRouter from "./routes/mocks.router.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { addLogger } from "./middleware/loggerMiddleware.js";
import { logger } from "./utils/logger.js";
import loggerTest from "./routes/loggerTest.js";

import { swaggerSpecs, swaggerUiMiddleware } from "./config/swagger.js";

import compression from "compression";

dotenv.config();

const app = express();

// const PORT = process.env.PORT || 8080;

// const connection = mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => logger.info("Conexión exitosa con Mongo Atlas"))
//   .catch((err) => logger.error("Error de conexión con MongoDB", err));

app.use(express.json());
app.use(cookieParser());
app.use(addLogger);
app.use(compression());

app.use(
  "/api/docs",
  swaggerUiMiddleware.serve,
  swaggerUiMiddleware.setup(swaggerSpecs)
);

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/api/mocks", mockingRouter);

app.use("/", loggerTest);

app.get("/", (req, res) => {
  res.send("API AdoptMe en funcionamiento");
});

app.use(errorHandler);

// app.listen(PORT, () => logger.info(`Servidor escuchando en el puerto ${PORT}`));
export default app;
