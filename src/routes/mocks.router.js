import { Router } from "express";
import UserModel from "../dao/models/User.js";
import PetModel from "../dao/models/Pet.js";
import { generateMockUser, generateMockPet } from "../mocks/generators.js";

const router = Router();

router.get("/mockingpets", (req, res) => {
  const { count = 100 } = req.query;
  const total = Number.parseInt(count, 10);
  const limit = Number.isNaN(total) || total <= 0 ? 100 : total;

  const pets = Array.from({ length: limit }, () => generateMockPet());

  res.json({ status: "success", payload: pets });
});

router.get("/mockingusers", (req, res) => {
  const { count = 50 } = req.query;
  const total = Number.parseInt(count, 10);
  const limit = Number.isNaN(total) || total <= 0 ? 50 : total;

  const users = Array.from({ length: limit }, () => generateMockUser());

  res.json({ status: "success", payload: users });
});

router.post("/generateData", async (req, res) => {
  const { users = 0, pets = 0 } = req.body;

  const usersToGenerate = Number.parseInt(users, 10) || 0;
  const petsToGenerate = Number.parseInt(pets, 10) || 0;

  const userMocks = [];
  const petMocks = [];

  for (let i = 0; i < usersToGenerate; i += 1) {
    const { _id, __v, createdAt, updatedAt, ...userData } = generateMockUser();
    userMocks.push(userData);
  }

  for (let i = 0; i < petsToGenerate; i += 1) {
    const { _id, __v, createdAt, updatedAt, ...petData } = generateMockPet();
    petMocks.push(petData);
  }

  try {
    const createdUsers = userMocks.length
      ? await UserModel.insertMany(userMocks)
      : [];
    const createdPets = petMocks.length
      ? await PetModel.insertMany(petMocks)
      : [];

    res.status(201).json({
      status: "success",
      message: "Datos generados e insertados correctamente",
      usersCreated: createdUsers.length,
      petsCreated: createdPets.length,
    });
  } catch (err) {
    req.logger?.error("Error generando los datos:", err);
    res
      .status(500)
      .json({ status: "error", message: "Error al insertar datos mocks" });
  }
});

export default router;
