import { Request } from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  getNotesByQuery,
  updateNoteById,
  deleteNoteById
} from '../src/controllers/noteController';
import { noteModel } from '../src/models/noteModel';
import { connect, disconnect } from '../src/repository/database';
import { mockResponse } from './mocks/mockResponse';
import { mockRequest } from './mocks/mockRequest';

jest.mock('../src/models/noteModel');
jest.mock('../src/repository/database');

describe('NoteController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNote', () => {
    test('should return 201 when note is created', async () => {
      const req = mockRequest({
        body: {
          text: 'Important note',
          date: '2025-06-01',
          _createdBy: 'user123'
        }
      });

      (noteModel as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ _id: 'note123' })
      }));

      const res = mockResponse();
      await createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: 'note123' });
    });
  });

  describe('getAllNotes', () => {
    test('should return 200 with note list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      (noteModel.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
      await getAllNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith([]);
    });
  });

  describe('getNoteById', () => {
    test('should return 200 with note', async () => {
      const req = mockRequest({ params: { id: 'note123' } });
      const res = mockResponse();

      (noteModel.findById as jest.Mock).mockResolvedValue({ _id: 'note123' });
      await getNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ _id: 'note123' });
    });
  });

  describe('getNotesByQuery', () => {
    test('should return 200 with matched notes', async () => {
      const req = mockRequest({ params: { field: 'text', value: 'important' } });
      const res = mockResponse();

      (noteModel.find as jest.Mock).mockResolvedValue([{ text: 'Important note' }]);
      await getNotesByQuery(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith([{ text: 'Important note' }]);
    });
  });

  describe('updateNoteById', () => {
    test('should return 200 when note is updated', async () => {
      const req = mockRequest({ params: { id: 'note123' }, body: {} });
      const res = mockResponse();

      (noteModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
      await updateNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Note was successfully updated.');
    });

    test('should return 404 when note not found', async () => {
      const req = mockRequest({ params: { id: 'notexist' }, body: {} });
      const res = mockResponse();

      (noteModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      await updateNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Cannot update note with id=notexist');
    });
  });

  describe('deleteNoteById', () => {
    test('should return 200 when note is deleted', async () => {
      const req = mockRequest({ params: { id: 'note123' } });
      const res = mockResponse();

      (noteModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      await deleteNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Note was successfully deleted.');
    });

    test('should return 404 when note is not found', async () => {
      const req = mockRequest({ params: { id: 'notexist' } });
      const res = mockResponse();

      (noteModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      await deleteNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Cannot delete note with id=notexist');
    });
  });
});
