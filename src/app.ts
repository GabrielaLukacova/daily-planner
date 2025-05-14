import express, { Application, Request, Response } from "express";
import dotenvFlow from "dotenv-flow";
import { connect } from "./repository/database";
import { setupSwagger } from "./swagger";
import router from "./routes";
import cors from "cors";

// Load environment variables
dotenvFlow.config();

// Create Express app
const app: Application = express();
app.use(express.json());

/**
 * ✅ Stable CORS configuration
 */
const allowedOrigins = [
  "http://localhost:5173", // Dev frontend
  "https://daily-planner-front.onrender.com", // Prod frontend
  "https://daily-planner-kyar.onrender.com",
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization", // for Bearer token
    "auth-token",    // for custom token header
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true, // allow cookies/auth headers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight support

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

