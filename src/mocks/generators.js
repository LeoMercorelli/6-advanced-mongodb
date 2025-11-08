import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export const generateMockUser = () => {
  const rolesDisponibles = ["user", "admin"];
  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("coder123", 10),
    role: rolesDisponibles[Math.floor(Math.random() * rolesDisponibles.length)],
    pets: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    __v: 0,
  };
};

export const generateMockPet = () => ({
  _id: faker.database.mongodbObjectId(),
  name: faker.person.firstName(),
  specie: faker.animal.type(),
  age: faker.number.int({ min: 1, max: 15 }),
  adopted: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  __v: 0,
});
