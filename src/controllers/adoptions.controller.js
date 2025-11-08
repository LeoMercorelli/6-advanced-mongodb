import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";
import { logger } from "../utils/logger.js";

const getAllAdoptions = async (req, res, next) => {
  try {
    const resultado = await adoptionsService.getAll();
    res.send({ status: "success", payload: resultado });
  } catch (error) {
    next(error);
  }
};

const getAdoption = async (req, res, next) => {
  try {
    const adopcionId = req.params.aid;
    const adopcion = await adoptionsService.getBy({ _id: adopcionId });
    if (!adopcion) {
      logger.warning(
        `GET /api/adoptions/${adopcionId} -> 404 Adopción no encontrada`
      );
      return res
        .status(404)
        .send({ status: "error", error: "Adopción no encontrada" });
    }
    res.send({ status: "success", payload: adopcion });
  } catch (error) {
    next(error);
  }
};

const createAdoption = async (req, res, next) => {
  try {
    const { uid, pid } = req.params;
    const usuario = await usersService.getUserById(uid);
    if (!usuario) {
      logger.warning(`${usuario} -> 404 Usuario no encontrado`);
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    }
    const mascota = await petsService.getBy({ _id: pid });
    if (!mascota) {
      logger.warning(`${mascota} -> 404 Mascota no encontrada`);
      return res
        .status(404)
        .send({ status: "error", error: "Mascota no encontrada" });
    }
    if (mascota.adopted) {
      logger.warning(`${mascota.id} -> 400 La mascota ya fue adoptada`);
      return res
        .status(400)
        .send({ status: "error", error: "La mascota ya fue adoptada" });
    }
    usuario.pets.push(mascota._id);
    await usersService.update(usuario._id, { pets: usuario.pets });
    await petsService.update(mascota._id, { adopted: true, owner: usuario._id });
    await adoptionsService.create({ owner: usuario._id, pet: mascota._id });
    res.send({ status: "success", message: "Mascota adoptada" });
  } catch (error) {
    next(error);
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
