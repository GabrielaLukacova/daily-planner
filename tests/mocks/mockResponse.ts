import { Response } from 'express';

export const mockResponse = (): Response => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  res.header = jest.fn().mockReturnThis();
  return res as Response;
};
