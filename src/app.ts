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
 * ✅ Enable CORS
 * Allows requests from both local dev and deployed frontend.
 */
function setupCors() {
  app.use(
    cors({
      origin: [
        "http://localhost:5173", // Local development frontend
        "https://daily-planner-front.onrender.com", // Replace with actual deployed frontend URL if needed
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization", // For bearer token (e.g. in notes)
        "auth-token",    // For login/register
        "Origin",
        "X-Requested-With",
        "Accept",
      ],
      credentials: true,
    })
  );
}

// Initialize CORS before any routes
setupCors();

// Swagger documentation
setupSwagger(app);

// Mount routes
app.use("/api", router);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Daily Planner API!");
});

// Start server and connect DB
export async function startServer() {
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
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 Swagger docs available at /api-docs`);
  });
}

export default app;

