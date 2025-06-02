import request from 'supertest';
import express, { Application } from 'express';
import { Request, Response } from 'express';
import cors from 'cors';

// mock external dependencies
jest.mock('../src/repository/database', () => ({
  connect: jest.fn()
}));

jest.mock('../src/swagger', () => ({
  setupSwagger: jest.fn()
}));

jest.mock('../src/controllers/devController', () => ({
  startCron: jest.fn((_req: any, res: any) => res.send('Cron started'))
}));

jest.mock('../src/routes', () => {
  const express = require('express');
  const router = express.Router();

  router.get('/test', (_req: Request, res: Response) => {
    res.send('router working');
  });

  return {
    __esModule: true,
    default: router,
  };
});

import { startServer } from '../src/app';
import { connect } from '../src/repository/database';
import { setupSwagger } from '../src/swagger';

let app: Application;

beforeAll(async () => {
  const listenMock = jest.fn((_port: number, cb: () => void) => cb());
  jest.spyOn(express.application, 'listen').mockImplementation(listenMock as any);

  app = express();
  app.use(cors());
  app.use(express.json());

  // load app logic
  await startServer(app);
});

  test('responds to root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Welcome to Daily Planner API');
  });

  test('responds to /api/test route', async () => {
    const response = await request(app).get('/api/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('router working');
  });