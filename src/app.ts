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
 * ✅ Enable CORS before routes
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Dev frontend
      "https://daily-planner-front.onrender.com", // Prod frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization", // for Bearer token
      "auth-token",    // for custom token header
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  })
);

// ✅ Respond to preflight requests
app.options("*", cors());

// Swagger docs
setupSwagger(app);

// Mount routes
app.use("/api", router);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Daily Planner API!");
});

// Start server
export async function startServer() {
  try {
    await connect();
    console.log("✅ MongoDB connection established");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB. Server will not start.");
    process.exit(1);
  }

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 Swagger docs available at /api-docs`);
  });
}

export default app;
