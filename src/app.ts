import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import { connect } from './repository/database';
import { setupSwagger } from './swagger';
import router from './routes'; 

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

// Start server
export function startServer() {
  connect();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;

