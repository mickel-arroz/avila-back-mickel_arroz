import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Ecommerce - Avila Tek Prueba",
      version: "1.0.0",
      description: "API de gestion de usuarios y productos",
    },
  },
  apis: [
    `${path.join(__dirname, "../routes/*.routes.*")}`,
    `${path.join(__dirname, "./swagger.routes.ts")}`,
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
