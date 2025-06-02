import { Request } from 'express';

export const mockRequest = (data: Partial<Request>): Request => {
  return {
    body: {},
    params: {},
    query: {},
    ...data,
  } as Request;
};
