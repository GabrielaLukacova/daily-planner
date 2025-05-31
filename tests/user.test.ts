import { registerUser, loginUser } from '../src/controllers/authController';
import { Request, Response } from 'express';
import { userModel } from '../src/models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockResponse } from './mocks/mockResponse';
import { mockRequest } from './mocks/mockRequest';

// mock dependencies to isolate controller logic
jest.mock('../src/models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController - registerUser', () => {
  test('Should return 201 when user is registered successfully', async () => {
    // Arrange
    const req = {
      body: {
        name: 'Julia Lalala',
        email: 'julia@gmail.com',
        password: '12345678',
      },
    } as Request;

    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedPasswordExample');
    (userModel as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ _id: 'user123' }),
    }));

    const res = mockResponse();

    // Act
    await registerUser(req, res, jest.fn());

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ error: null, data: 'user123' });
  });

  test('Should return 400 when email already exists', async () => {
    // Arrange
    const req = {
      body: {
        name: 'Julia Lalala',
        email: 'julia@gmail.com',
        password: '12345678',
      },
    } as Request;

    (userModel.findOne as jest.Mock).mockResolvedValue({});
    const res = mockResponse();

    // Act
    await registerUser(req, res, jest.fn());

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists.' });
  });
});

describe('AuthController - loginUser', () => {
  test('Should return 200 when login is successful', async () => {
    // Arrange
    const req = {
      body: {
        email: 'julia@gmail.com',
        password: '12345678',
      },
    } as Request;

    (userModel.findOne as jest.Mock).mockResolvedValue({
      name: 'Julia Lalala',
      email: 'julia@gmail.com',
      id: 'user123',
      password: '$2b$10$hashedPasswordExample',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocked.jwt.token');
    const res = mockResponse();

    // Act
    await loginUser(req, res, jest.fn());

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.header).toHaveBeenCalledWith('auth-token', 'mocked.jwt.token');
    expect(res.json).toHaveBeenCalledWith({
      error: null,
      data: { userId: 'user123', token: 'mocked.jwt.token' },
    });
  });

  test('Should return 400 for invalid password', async () => {
    // Arrange
    const req = {
      body: {
        email: 'julia@gmail.com',
        password: 'wrongpass',
      },
    } as Request;

    (userModel.findOne as jest.Mock).mockResolvedValue({
      email: 'julia@gmail.com',
      password: '$2b$10$hashedPasswordExample',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const res = mockResponse();

    // Act
    await loginUser(req, res, jest.fn());

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email or password is incorrect' });
  });
});
