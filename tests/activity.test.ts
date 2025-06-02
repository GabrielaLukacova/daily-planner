import { Request } from 'express';
import {
  createActivity,
  getAllActivities,
  getActivityById,
  getActivitiesByQuery,
  updateActivityById,
  deleteActivityById,
} from '../src/controllers/activityController';
import { activityModel } from '../src/models/activityModel';
import { connect, disconnect } from '../src/repository/database';
import { mockResponse } from './mocks/mockResponse';
import { mockRequest } from './mocks/mockRequest';

jest.mock('../src/models/activityModel');
jest.mock('../src/repository/database');

describe('ActivityController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createActivity', () => {
    test('should return 201 when activity is created', async () => {
      const req = mockRequest({
        body: {
          title: 'Meeting',
          description: 'Discuss roadmap',
          date: '2025-01-01',
          startTime: '10:00',
          endTime: '11:00',
          place: 'Zoom',
          isRepeating: false,
          repeating: null,
          _createdBy: 'user123',
        },
      });

      (activityModel as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ _id: 'activity123' }),
      }));

      const res = mockResponse();
      await createActivity(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: 'activity123' });
    });
  });

  describe('getAllActivities', () => {
    test('should return 200 with activity list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      (activityModel.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
      await getAllActivities(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getActivityById', () => {
    test('should return 200 with activity', async () => {
      const req = mockRequest({ params: { id: 'activity123' } });
      const res = mockResponse();

      (activityModel.findById as jest.Mock).mockResolvedValue({ _id: 'activity123' });
      await getActivityById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: 'activity123' });
    });
  });

  describe('getActivitiesByQuery', () => {
    test('should return 200 with matched activities', async () => {
      const req = mockRequest({ params: { field: 'title', value: 'Meeting' } });
      const res = mockResponse();

      (activityModel.find as jest.Mock).mockResolvedValue([{ title: 'Meeting' }]);
      await getActivitiesByQuery(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ title: 'Meeting' }]);
    });
  });

  describe('updateActivityById', () => {
    test('should return 200 when activity is updated', async () => {
      const req = mockRequest({ params: { id: 'activity123' }, body: {} });
      const res = mockResponse();

      (activityModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
      await updateActivityById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Activity updated successfully' });
    });

    test('should return 404 when activity not found', async () => {
      const req = mockRequest({ params: { id: 'notexist' }, body: {} });
      const res = mockResponse();

      (activityModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      await updateActivityById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Activity not found' });
    });
  });

  describe('deleteActivityById', () => {
    test('should return 200 when activity is deleted', async () => {
      const req = mockRequest({ params: { id: 'activity123' } });
      const res = mockResponse();

      (activityModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      await deleteActivityById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Activity deleted successfully' });
    });

    test('should return 404 when activity is not found', async () => {
      const req = mockRequest({ params: { id: 'notexist' } });
      const res = mockResponse();

      (activityModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      await deleteActivityById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Activity not found' });
    });
  });
});
