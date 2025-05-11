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
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          }
        },
        Task: {
          type: "object",
          required: ["title", "userId"],
          properties: {
            userId: { type: "string" },
            title: { type: "string" },
            isCompleted: {
              type: "boolean",
              default: false,
            },
            highPriority: {
              type: "boolean",
              default: false,
            }
          }
        }
      }
    }
  },
  apis: ["./src/**/*.ts"], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: Application) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
