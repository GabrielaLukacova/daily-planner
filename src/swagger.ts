const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
import { Application } from 'express';

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Daily Planner API",
      version: "1.0.0",
      description: "API documentation for daily planner backend",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Local server",
      },

      
      {
        url: "https://daily-planner-kyar.onrender.com", 
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Enter your API key in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },
        Task: {
          type: "object",
          required: [
             "title", "_createdBy"],
          properties: {
            title: { type: "string" },
            isCompleted: {
              type: "boolean",
              default: false,
            },
            highPriority: {
              type: "boolean",
              default: false,
            },
            _createdBy: { type: "string" },  
          },
        },
        Activity: {
          type: "object",
          required: [
            "title",
            "date",
            "startTime",
            "endTime",
            "_createdBy"
          ],
          properties: {
            title: { type: "string" },
            description: { type: "string" },  
            date: { type: "string", format: "date" },
            startTime: { type: "string" },
            endTime: { type: "string" },
            place: { type: "string" },  
            isRepeating: { type: "boolean" },  
            repeating: {
              type: "string",
              enum: ["None", "Daily", "Weekly", "Monthly"],  
              default: "None",
            },
            _createdBy: { type: "string" },  
          },
        },        
        Note: {
          type: "object",
          required: [ 
            "text", "date", "_createdBy"],
          properties: {
            text: { type: "string" },
            date: { type: "string", format: "date" },
            _createdBy: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ["./src/**/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: Application) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
} 