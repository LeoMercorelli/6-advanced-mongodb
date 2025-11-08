import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import { logger } from "../utils/logger.js";

const getAllPets = async (req, res, next) => {
  try {
    const mascotas = await petsService.getAll();
    res.send({ status: "success", payload: mascotas });
  } catch (error) {
    next(error);
  }
};

const createPet = async (req, res, next) => {
  try {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) {
      logger.warning(`400 Valores incompletos`);
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    }
    const mascota = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const resultado = await petsService.create(mascota);
    res.send({ status: "success", payload: resultado });
  } catch (error) {
    next(error);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const cuerpoActualizacionMascota = req.body;
    const mascotaId = req.params.pid;
    // Validación de existencia de la mascota
    const esMascota = await petsService.getBy({ _id: mascotaId });
    if (!esMascota) {
      logger.warning(`${mascotaId} -> 404 Mascota no encontrada`);
      return res
        .status(404)
        .send({ status: "error", error: "Mascota no encontrada" });
    }
    //
    await petsService.update(mascotaId, cuerpoActualizacionMascota);
    res.send({ status: "success", message: "Mascota actualizada" });
  } catch (error) {
    next(error);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const mascotaId = req.params.pid;
    // Validación de existencia de la mascota
    const esMascota = await petsService.getBy({ _id: mascotaId });
    if (!esMascota) {
      logger.warning(`${mascotaId} -> 404 Mascota no encontrada`);
      return res
        .status(404)
        .send({ status: "error", error: "Mascota no encontrada" });
    }
    //
    await petsService.delete(mascotaId);
    res.send({ status: "success", message: "Mascota eliminada" });
  } catch (error) {
    next(error);
  }
};

const createPetWithImage = async (req, res, next) => {
  try {
    const archivo = req.file;
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) {
      logger.warning(`400 Valores incompletos`);
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    }
    console.log("Archivo recibido para la mascota:", archivo);
    const mascota = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/pets/${archivo.filename}`,
    });
    console.log("Datos listos para crear la mascota:", mascota);
    const resultado = await petsService.create(mascota);
    res.send({ status: "success", payload: resultado });
  } catch (error) {
    next(error);
  }
};
export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
