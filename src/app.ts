import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import { testConnection } from './repository/database';
import { setupSwagger } from './swagger';

// Load environment variables
dotenvFlow.config();

// Create Express app
const app: Application = express();
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

// Define routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Daily Planner API!');
});

// Start server function
export function startServer() {
  // Test DB connection
  testConnection();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;
