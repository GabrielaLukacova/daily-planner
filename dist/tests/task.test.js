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
const taskController_1 = require("../src/controllers/taskController");
const taskModel_1 = require("../src/models/taskModel");
const mockResponse_1 = require("./mocks/mockResponse");
const mockRequest_1 = require("./mocks/mockRequest");
jest.mock('../src/models/taskModel');
describe('TaskController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createTask', () => {
        test('should return 201 when task is created', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({
                body: {
                    title: 'Finish report',
                    _createdBy: 'user123'
                }
            });
            taskModel_1.taskModel.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({ _id: 'task123' })
            }));
            const res = (0, mockResponse_1.mockResponse)();
            yield (0, taskController_1.createTask)(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ _id: 'task123' });
        }));
    });
    describe('getAllTasks', () => {
        test('should return 200 with task list', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ query: {} });
            const res = (0, mockResponse_1.mockResponse)();
            taskModel_1.taskModel.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
            yield (0, taskController_1.getAllTasks)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        }));
    });
    describe('getTaskById', () => {
        test('should return 200 with task', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'task123' } });
            const res = (0, mockResponse_1.mockResponse)();
            taskModel_1.taskModel.findById.mockResolvedValue({ _id: 'task123' });
            yield (0, taskController_1.getTaskById)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ _id: 'task123' });
        }));
        test('should return 404 when task not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'notfound' } });
            const res = (0, mockResponse_1.mockResponse)();
            taskModel_1.taskModel.findById.mockResolvedValue(null);
            yield (0, taskController_1.getTaskById)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
        }));
    });
    describe('updateTaskById', () => {
        test('should return 200 when task is updated', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({
                params: { id: 'task123' },
                body: { title: 'Updated', isCompleted: true, highPriority: false }
            });
            const res = (0, mockResponse_1.mockResponse)();
            taskModel_1.taskModel.findByIdAndUpdate.mockResolvedValue({});
            yield (0, taskController_1.updateTaskById)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({});
        }));
        test('should return 404 when task not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({
                params: { id: 'notexist' },
                body: { title: 'Updated', isCompleted: true, highPriority: false }
            });
            const res = (0, mockResponse_1.mockResponse)();
            taskModel_1.taskModel.findByIdAndUpdate.mockResolvedValue(null);
            yield (0, taskController_1.updateTaskById)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
        }));
    });
    describe('deleteTaskById', () => {
        test('should return 200 when task is deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'task123' } });
            const res = (0, mockResponse_1.mockResponse)();
            taskModel_1.taskModel.findByIdAndDelete.mockResolvedValue({});
            yield (0, taskController_1.deleteTaskById)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
        }));
        test('should return 404 when task not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'notfound' } });
            const res = (0, mockResponse_1.mockResponse)();
            taskModel_1.taskModel.findByIdAndDelete.mockResolvedValue(null);
            yield (0, taskController_1.deleteTaskById)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
        }));
    });
});
//# sourceMappingURL=task.test.js.map