import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import cors from 'cors';
import { connect } from './repository/database';
import { setupSwagger } from './swagger';
import { startCron } from './controllers/devController';

// Load environment variables
dotenvFlow.config();

// Start server
export async function startServer() {
  try {
    console.log('🌐 Connecting to MongoDB...');
    await connect();
    console.log('✅ MongoDB connection established');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB. Server will not start.');
    process.exit(1);
  }

  const app: Application = express();

  /**
   * ✅ Stable CORS configuration with logging
   */
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://daily-planner-front.onrender.com',
    'https://daily-planner-kyar.onrender.com',
    'https://planit-41v2.onrender.com',
  ];

  const corsOptions = {
    origin: function (origin: any, callback: any) {
      console.log('🔍 Incoming origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('✅ Allowed by CORS:', origin);
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'auth-token',
      'Origin',
      'X-Requested-With',
      'Accept',
    ],
    credentials: true,
  };

  // 💡 Apply CORS *before* JSON parser and routes
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  app.use(express.json());

  // Optional: Log requests (can be removed)
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Swagger docs
  setupSwagger(app);

  // Cron route
  app.get('/startCron/:duration', startCron);

  // 👇 Import routes AFTER DB connection
  const router = (await import('./routes')).default;
  app.use('/api', router);

  // Root route
  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Daily Planner API!');
  });

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 Swagger docs available at /api-docs`);
  });
}

export default startServer;
