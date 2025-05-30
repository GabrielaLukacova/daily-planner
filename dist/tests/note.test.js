"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const noteController_1 = require("../src/controllers/noteController");
const noteModel_1 = require("../src/models/noteModel");
const mockResponse_1 = require("./mocks/mockResponse");
const mockRequest_1 = require("./mocks/mockRequest");
jest.mock('../src/models/noteModel');
jest.mock('../src/repository/database');
describe('NoteController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createNote', () => {
        test('should return 201 when note is created', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({
                body: {
                    text: 'Important note',
                    date: '2025-06-01',
                    _createdBy: 'user123'
                }
            });
            noteModel_1.noteModel.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({ _id: 'note123' })
            }));
            const res = (0, mockResponse_1.mockResponse)();
            yield (0, noteController_1.createNote)(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ _id: 'note123' });
        }));
    });
    describe('getAllNotes', () => {
        test('should return 200 with note list', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ query: {} });
            const res = (0, mockResponse_1.mockResponse)();
            noteModel_1.noteModel.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
            yield (0, noteController_1.getAllNotes)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith([]);
        }));
    });
    describe('getNoteById', () => {
        test('should return 200 with note', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'note123' } });
            const res = (0, mockResponse_1.mockResponse)();
            noteModel_1.noteModel.findById.mockResolvedValue({ _id: 'note123' });
            yield (0, noteController_1.getNoteById)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ _id: 'note123' });
        }));
    });
    describe('getNotesByQuery', () => {
        test('should return 200 with matched notes', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { field: 'text', value: 'important' } });
            const res = (0, mockResponse_1.mockResponse)();
            noteModel_1.noteModel.find.mockResolvedValue([{ text: 'Important note' }]);
            yield (0, noteController_1.getNotesByQuery)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith([{ text: 'Important note' }]);
        }));
    });
    describe('updateNoteById', () => {
        test('should return 200 when note is updated', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'note123' }, body: {} });
            const res = (0, mockResponse_1.mockResponse)();
            noteModel_1.noteModel.findByIdAndUpdate.mockResolvedValue({});
            yield (0, noteController_1.updateNoteById)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('Note was successfully updated.');
        }));
        test('should return 404 when note not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'notexist' }, body: {} });
            const res = (0, mockResponse_1.mockResponse)();
            noteModel_1.noteModel.findByIdAndUpdate.mockResolvedValue(null);
            yield (0, noteController_1.updateNoteById)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Cannot update note with id=notexist');
        }));
    });
    describe('deleteNoteById', () => {
        test('should return 200 when note is deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'note123' } });
            const res = (0, mockResponse_1.mockResponse)();
            noteModel_1.noteModel.findByIdAndDelete.mockResolvedValue({});
            yield (0, noteController_1.deleteNoteById)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('Note was successfully deleted.');
        }));
        test('should return 404 when note is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'notexist' } });
            const res = (0, mockResponse_1.mockResponse)();
            noteModel_1.noteModel.findByIdAndDelete.mockResolvedValue(null);
            yield (0, noteController_1.deleteNoteById)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Cannot delete note with id=notexist');
        }));
    });
});
//# sourceMappingURL=note.test.js.map