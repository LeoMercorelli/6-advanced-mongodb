import { usersService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllUsers = async (req, res, next) => {
  try {
    const usuarios = await usersService.getAll();
    res.send({ status: "success", payload: usuarios });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const usuarioId = req.params.uid;
    const usuario = await usersService.getUserById(usuarioId);
    if (!usuario)
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    res.send({ status: "success", payload: usuario });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const cuerpoActualizacion = req.body;
    const usuarioId = req.params.uid;
    const usuario = await usersService.getUserById(usuarioId);
    if (!usuario)
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    await usersService.update(usuarioId, cuerpoActualizacion);
    res.send({ status: "success", message: "Usuario actualizado" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const usuarioId = req.params.uid;
    const resultado = await usersService.getUserById(usuarioId);
    // Validación de existencia de Usuario
    if (!resultado)
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    //
    await usersService.delete(usuarioId);
    res.send({ status: "success", message: "Usuario eliminado" });
  } catch (error) {
    next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    const usuarioId = req.params.uid;
    const usuario = await usersService.getUserById(usuarioId);
    if (!usuario)
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    const documentos = req.files.map((archivo) => ({
      name: archivo.originalname,
      reference: `${__dirname}/../public/documents/${archivo.filename}`,
    }));
    usuario.documents.push(...documentos);
    await usuario.save();

    res.send({ status: "success", payload: usuario });
  } catch (error) {
    next(error);
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  postUser,
};
