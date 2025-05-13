import express, { Application, Request, Response } from "express";
import dotenvFlow from "dotenv-flow";
import { connect } from "./repository/database";
import { setupSwagger } from "./swagger";
import router from "./routes";
import cors from "cors";

// Load env vars
dotenvFlow.config();

// Create Express app
const app: Application = express();
app.use(express.json());

/**
 * Enable CORS
 */
function setupCors() {
  app.use(
    cors({
      origin: "*",
      methods: "GET, PUT, POST, DELETE",
      allowedHeaders: [
        "auth-token",
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
      ],
      credentials: true,
    })
  );
}

// Swagger docs
setupSwagger(app);

// Mount all routes under /api
app.use("/api", router);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Daily Planner API!");
});

// Start server
export async function startServer() {
  setupCors();

  try {
    await connect();
    console.log("✅ MongoDB connection established");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB. Server will not start.");
    console.error(error);
    process.exit(1);
  }

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;
