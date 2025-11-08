import { Router } from "express";

const router = Router();

router.get("/loggerTest", (req, res) => {
  req.logger.debug("Mensaje de depuración");
  req.logger.http("Registro HTTP");
  req.logger.info("Registro informativo");
  req.logger.warning("Registro de advertencia");
  req.logger.error("Registro de error");
  req.logger.fatal("Registro fatal");

  res.send("Logs enviados. Ver consola y/o archivo errors.log");
});

export default router;
