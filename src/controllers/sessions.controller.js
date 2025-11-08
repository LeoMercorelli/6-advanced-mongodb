import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password)
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    const existe = await usersService.getUserByEmail(email);
    if (existe)
      return res
        .status(400)
        .send({ status: "error", error: "El usuario ya existe" });
    const contrasenaEncriptada = await createHash(password);
    const usuario = {
      first_name,
      last_name,
      email,
      password: contrasenaEncriptada,
    };
    const resultado = await usersService.create(usuario);
    console.log("Usuario registrado:", resultado);
    res.send({ status: "success", payload: resultado._id });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    const usuario = await usersService.getUserByEmail(email);
    if (!usuario)
      return res
        .status(404)
        .send({ status: "error", error: "El usuario no existe" });
    const contrasenaValida = await passwordValidation(usuario, password);
    if (!contrasenaValida)
      return res
        .status(400)
        .send({ status: "error", error: "Contraseña incorrecta" });

    await usersService.update(usuario, {
      last_connection: new Date(),
    });

    const usuarioDto = UserDTO.getUserTokenFrom(usuario);
    const token = jwt.sign(usuarioDto, "tokenSecretJWT", { expiresIn: "1h" });
    res
      .cookie("coderCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Sesión iniciada" });
  } catch (err) {
    next(err);
  }
};

const current = async (req, res, next) => {
  try {
    const cookie = req.cookies["coderCookie"];
    const usuario = jwt.verify(cookie, "tokenSecretJWT");
    if (usuario) return res.send({ status: "success", payload: usuario });
  } catch (err) {
    next(err);
  }
};

const unprotectedLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    const usuario = await usersService.getUserByEmail(email);
    if (!usuario)
      return res
        .status(404)
        .send({ status: "error", error: "El usuario no existe" });
    const contrasenaValida = await passwordValidation(usuario, password);
    if (!contrasenaValida)
      return res
        .status(400)
        .send({ status: "error", error: "Contraseña incorrecta" });
    const token = jwt.sign(usuario, "tokenSecretJWT", { expiresIn: "1h" });
    res
      .cookie("unprotectedCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Sesión abierta sin protección" });
  } catch (err) {
    next(err);
  }
};
const unprotectedCurrent = async (req, res, next) => {
  try {
    const cookie = req.cookies["unprotectedCookie"];
    const usuario = jwt.verify(cookie, "tokenSecretJWT");
    if (usuario) return res.send({ status: "success", payload: usuario });
  } catch (err) {
    next(err);
  }
};
export default {
  current,
  login,
  register,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};
