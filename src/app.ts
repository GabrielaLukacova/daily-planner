import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import { testConnection } from './repository/database';

// Load environment variables
dotenvFlow.config();

// Create express app
const app: Application = express();

// Define routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Daily Planner API!');
});

// Start the server
export function startServer() {


// Test connection to database
  testConnection();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function() {
    console.log('Server is running on port:' + PORT);
  });
}
