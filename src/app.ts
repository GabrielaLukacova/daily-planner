import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import cors from 'cors';
import { connect } from './repository/database';
import { setupSwagger } from './swagger';
import { startCron } from './controllers/devController';

dotenvFlow.config();

export async function startServer(customApp?: Application) {
  const app: Application = customApp || express();

  // Only connect to DB if not in test
  if (!customApp) {
    try {
      console.log('🌐 Connecting to MongoDB...');
      await connect();
      console.log('✅ MongoDB connection established');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB. Server will not start.');
      process.exit(1);
    }
  }

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

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  setupSwagger(app);
  app.get('/startCron/:duration', startCron);

  const router = (await import('./routes')).default;
  app.use('/api', router);

  app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Daily Planner API!');
  });

  if (!customApp) {
    const PORT: number = parseInt(process.env.PORT as string) || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 Swagger docs available at /api-docs`);
    });
  }

  return app;
}

export default startServer;
