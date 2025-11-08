import app from "../app.js";
import request from "supertest";
import chai from "chai";
import mongoose from "mongoose";

const { expect } = chai;

describe("API de sesiones", function () {
  let testUser = {
    first_name: "Test First",
    last_name: "Test Last ",
    email: "testuser@test.com",
    password: "coder123",
  };

  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async function () {
    await mongoose.connection
      .collection("users")
      .deleteMany({ email: "testuser@test.com" });
    await mongoose.connection.close();
  });

  it("/api/sessions/register: registrar un usuario nuevo", async function () {
    const res = await request(app)
      .post("/api/sessions/register")
      .send(testUser);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("payload");
  });

  it("/api/sessions/register: status 400 si no se envian todos los parametros", async function () {
    const testUser400 = {
      first_name: testUser.first_name,
      last_name: testUser.last_name,
      email: testUser.email,
      //password: testUser.password,
    };
    const res400 = await request(app)
      .post("/api/sessions/register")
      .send(testUser400);
    expect(res400.status).to.equal(400);
    expect(res400.body).to.have.property("status", "error");
    expect(res400.body).to.have.property("error", "Valores incompletos");
  });

  it("/api/sessions/register: status 400 si el usuario ya existe", async function () {
    const res = await request(app)
      .post("/api/sessions/register")
      .send(testUser);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("status", "error");
    expect(res.body).to.have.property("error", "El usuario ya existe");
  });

  it("/api/sessions/login: loguear el usuario resgistrado", async function () {
    const res = await request(app)
      .post("/api/sessions/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("message", "Sesión iniciada");

    const cookies = res.headers["set-cookie"];
    expect(cookies).to.satisfy((arr) =>
      arr.some((c) => c.includes("coderCookie"))
    );
  });

  it("/api/sessions/login: status 400 si la constrasenia es incorrecta", async function () {
    const res400 = await request(app)
      .post("/api/sessions/login")
      .send({ email: testUser.email, password: "passwordincorrecto" });

    expect(res400.status).to.equal(400);
    expect(res400.body).to.have.property("status", "error");
    expect(res400.body).to.have.property("error", "Contraseña incorrecta");
  });

  it("/api/sessions/login: status 400 si no se envian todos los parametros", async function () {
    const res400 = await request(app).post("/api/sessions/login").send({
      email: testUser.email,
    });

    expect(res400.status).to.equal(400);
    expect(res400.body).to.have.property("status", "error");
    expect(res400.body).to.have.property("error", "Valores incompletos");
  });

  it("/api/sessions/login: status 404 si el usuario no existe al intetar logearse", async function () {
    const res404 = await request(app)
      .post("/api/sessions/login")
      .send({ email: "no@exist", password: testUser.password });

    expect(res404.status).to.equal(404);
    expect(res404.body).to.have.property("status", "error");
    expect(res404.body).to.have.property("error", "El usuario no existe");
  });
});
