const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
import { Application } from 'express';

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Daily Planner API",
      version: "1.0.0",
      description: "API documentation for your daily planner backend",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local server",
      },
      {
        url: "https://ments-api-2t08.onrender.com",
        description: "Production server",
      },
    ],
  },
  apis: ["./routes.ts"], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: Application) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}