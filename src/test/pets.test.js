import app from "../app.js";
import request from "supertest";
import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { expect } = chai;
chai.use(chaiHttp);

describe("API de mascotas", function () {
  let createdPetId;
  let createdPetWithImageId;
  let notFoundId = "00000000ffffffffffffffff";
  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async function () {
    await mongoose.model("Pets").deleteOne({ _id: createdPetId });
    await mongoose.model("Pets").deleteOne({ _id: createdPetWithImageId });
    await mongoose.connection.close();
  });

  it("/api/pets: devolver todas las mascotas", async function () {
    const res = await request(app).get("/api/pets");
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array");
  });

  it("/api/pets: crear una mascota", async function () {
    const newPet = {
      name: "Test",
      specie: "test",
      birthDate: "1/1/1981",
    };

    const res = await request(app).post("/api/pets").send(newPet);
    expect(res).to.have.status(200);
    expect(res.body.payload).to.include.keys(
      "_id",
      "name",
      "specie",
      "birthDate"
    );
    expect(res.body.payload).to.have.property("name").that.equals(newPet.name);
    expect(res.body.payload)
      .to.have.property("specie")
      .that.equals(newPet.specie);
    createdPetId = res.body.payload._id;
  });

  it("/api/pets: status 400 al no recibir todos los parametros", async function () {
    const newPet400 = {
      name: "Test",
      specie: "test",
    };
    const res400 = await request(app).post("/api/pets").send(newPet400);
    expect(res400).to.have.status(400);
    expect(res400.body.error).to.equal("Valores incompletos");
  });

  it("/api/pets/withimage: crear una mascota con imagen", async function () {
    const imagePath = path.join(
      __dirname,
      "../public/img/1671549990926-coderDog.jpg"
    );
    console.log("Ruta de la imagen de prueba:", imagePath);
    const newPetWithImage = {
      name: "Test",
      species: "test",
      birthDate: "1/1/1981",
    };

    const res = await request(app)
      .post("/api/pets/withimage")
      .field("name", newPetWithImage.name)
      .field("specie", newPetWithImage.species)
      .field("birthDate", newPetWithImage.birthDate)
      .attach("image", imagePath);
    expect(res).to.have.status(200);
    expect(res.body.payload).to.include.keys("_id", "name", "image");
    createdPetWithImageId = res.body.payload._id;
  });

  it("/api/pets/withimage: status 400 al no recibir todos los parametros", async function () {
    const newPetWithImage404 = {
      name: "Test",
      species: "test",
      birthDate: "1/1/1981",
    };
    const res400 = await request(app)
      .post("/api/pets/withimage")
      .field("name", newPetWithImage404.name)
      .field("specie", newPetWithImage404.species);
    // .attach("image", imagePath);
    expect(res400).to.have.status(400);
    expect(res400.body.error).to.equal("Valores incompletos");
  });

  it("/api/pets/:pid: actualizar una mascota", async function () {
    const res = await request(app)
      .put(`/api/pets/${createdPetId}`)
      .send({ name: "TestUpdate" });
    const updatedPet = await mongoose.model("Pets").findById(createdPetId);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Mascota actualizada");
    expect(updatedPet.name).to.equal("TestUpdate");
  });

  it("/api/pets/:pid: status 404 al no encontrar la mascota a actualizar", async function () {
    const res404 = await request(app)
      .put(`/api/pets/${notFoundId}`)
      .send({ name: "TestUpdate" });
    expect(res404.status).to.equal(404);
  });

  it("/api/pets/:pid: borrar una mascota por id", async function () {
    const res = await request(app).delete(`/api/pets/${createdPetId}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Mascota eliminada");
  });

  it("/api/pets/:pid: status 404 al no encontrar la mascota a borrar", async function () {
    const res404 = await request(app).delete(`/api/pets/${notFoundId}`);
    expect(res404.status).to.equal(404);
  });
});
