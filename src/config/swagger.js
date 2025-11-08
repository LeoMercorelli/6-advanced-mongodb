import swaggerJSDoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "API - Proyecto Adoptme",
      version: "1.0.0",
      description: "Documentacion de la Api para Sessions, Pets y Adoptions",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
export const swaggerUiMiddleware = swaggerui;
