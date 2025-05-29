import { Request } from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById
} from '../src/controllers/taskController';
import { taskModel } from '../src/models/taskModel';
import { mockResponse } from './mocks/mockResponse';
import { mockRequest } from './mocks/mockRequest';

jest.mock('../src/models/taskModel');

describe('TaskController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    test('should return 201 when task is created', async () => {
      const req = mockRequest({
        body: {
          title: 'Finish report',
          _createdBy: 'user123'
        }
      });

      (taskModel as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ _id: 'task123' })
      }));

      const res = mockResponse();
      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: 'task123' });
    });
  });

  describe('getAllTasks', () => {
    test('should return 200 with task list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      (taskModel.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
      await getAllTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getTaskById', () => {
    test('should return 200 with task', async () => {
      const req = mockRequest({ params: { id: 'task123' } });
      const res = mockResponse();

      (taskModel.findById as jest.Mock).mockResolvedValue({ _id: 'task123' });
      await getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: 'task123' });
    });

    test('should return 404 when task not found', async () => {
      const req = mockRequest({ params: { id: 'notfound' } });
      const res = mockResponse();

      (taskModel.findById as jest.Mock).mockResolvedValue(null);
      await getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('updateTaskById', () => {
    test('should return 200 when task is updated', async () => {
      const req = mockRequest({
        params: { id: 'task123' },
        body: { title: 'Updated', isCompleted: true, highPriority: false }
      });
      const res = mockResponse();

      (taskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
      await updateTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({});
    });

    test('should return 404 when task not found', async () => {
      const req = mockRequest({
        params: { id: 'notexist' },
        body: { title: 'Updated', isCompleted: true, highPriority: false }
      });
      const res = mockResponse();

      (taskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      await updateTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('deleteTaskById', () => {
    test('should return 200 when task is deleted', async () => {
      const req = mockRequest({ params: { id: 'task123' } });
      const res = mockResponse();

      (taskModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      await deleteTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });

    test('should return 404 when task not found', async () => {
      const req = mockRequest({ params: { id: 'notfound' } });
      const res = mockResponse();

      (taskModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      await deleteTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });
});
