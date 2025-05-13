import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import { connect } from './repository/database';
import { setupSwagger } from './swagger';
import router from './routes'; 
import cors from 'cors';


// Load environment variables
dotenvFlow.config();

// Create Express app
const app: Application = express();
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

// API Routes
app.use('/api', router); // All routes will be under /api

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Daily Planner API!');
});

/**
 * Setup CORS handling to allow cross-origin requests
 */
function setupCors() {
  app.use(cors({
      origin: "*", // Allow requests from any origin
      methods: 'GET, PUT, POST, DELETE', // Allowed HTTP methods
      allowedHeaders: ['auth-token', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'], // Allowed headers
      credentials: true // Allow credentials
  }));
}

// Start server

export function startServer() {
  setupCors();



  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;

