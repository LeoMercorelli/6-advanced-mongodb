import app from "../app.js";
import request from "supertest";
import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import adoptionModel from "../dao/models/Adoption.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("API de adopciones", function () {
  let createdAdoptionId;
  let createdUserId;
  let createdPetId;
  let notFoundId = "00000000ffffffffffffffff";

  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);
    const newUser = await mongoose.model("Users").create({
      first_name: "TestUser",
      last_name: "User",
      email: "test@example.com",
      password: "coder123",
      role: "user",
    });
    createdUserId = newUser._id;

    const newPet = await mongoose.model("Pets").create({
      name: "TestPet",
      specie: "Pet",
      birthDate: "1/1/1981",
      adopted: false,
    });
    createdPetId = newPet._id;
  });
  after(async function () {
    await mongoose.model("Users").deleteOne({ _id: createdUserId });
    await mongoose.model("Pets").deleteOne({ _id: createdPetId });

    await mongoose.connection.close();
  });

  it("/api/adoptions: obtener todas las adopciones", async function () {
    const res = await request(app).get("/api/adoptions");
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array");
  });

  it("/api/adoptions/:uid/:pid: crear una adopcion", async function () {
    const uid = createdUserId;
    const pid = createdPetId;
    const res = await request(app).post(`/api/adoptions/${uid}/${pid}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Mascota adoptada");
    const createdAdoption = await adoptionModel
      .findOne({
        owner: uid,
        pet: pid,
      })
      .lean();
    expect(createdAdoption).to.exist;
    createdAdoptionId = createdAdoption._id.toString();
  });

  it("/api/adoptions/:uid/:pid: status 404 si no encuentra pid o uid al crear una adopcion", async function () {
    const uid = createdUserId;
    const pid = createdPetId;
    const resUid404 = await request(app).post(
      `/api/adoptions/${notFoundId}/${pid}`
    );
    expect(resUid404.status).to.equal(404);
    expect(resUid404.body.error).to.equal("Usuario no encontrado");

    const resPid404 = await request(app).post(
      `/api/adoptions/${uid}/${notFoundId}`
    );
    expect(resPid404.status).to.equal(404);
    expect(resPid404.body.error).to.equal("Mascota no encontrada");
  });

  it("/api/adoptions/:uid/:pid: status 400 si la mascota ya esta adotada al crear una adopcion", async function () {
    const uid = createdUserId;
    const pid = createdPetId;
    const resAdopted = await request(app).post(`/api/adoptions/${uid}/${pid}`);
    expect(resAdopted.status).to.equal(400);
    expect(resAdopted.body.error).to.equal("La mascota ya fue adoptada");
  });

  it("/api/adoptions/:aid: recupearar una adopcion particular", async function () {
    const res = await request(app).get(`/api/adoptions/${createdAdoptionId}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload)
      .to.have.property("owner")
      .that.equals(createdUserId.toString());
    expect(res.body.payload)
      .to.have.property("pet")
      .that.equals(createdPetId.toString());
  });

  it("/api/adoptions/:aid: status 404 si no se encuentra la adopcion al intentar recuperarla", async function () {
    const res404 = await request(app).get(`/api/adoptions/${notFoundId}`);
    expect(res404.status).to.equal(404);
    expect(res404.body.error).to.equal("Adopción no encontrada");
  });
});
