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
const activityController_1 = require("../src/controllers/activityController");
const activityModel_1 = require("../src/models/activityModel");
const mockResponse_1 = require("./mocks/mockResponse");
const mockRequest_1 = require("./mocks/mockRequest");
jest.mock('../src/models/activityModel');
jest.mock('../src/repository/database');
describe('ActivityController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createActivity', () => {
        test('should return 201 when activity is created', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({
                body: {
                    title: 'Meeting',
                    description: 'Discuss roadmap',
                    date: '2025-01-01',
                    startTime: '10:00',
                    endTime: '11:00',
                    place: 'Zoom',
                    isRepeating: false,
                    repeating: null,
                    _createdBy: 'user123'
                }
            });
            activityModel_1.activityModel.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({ _id: 'activity123' })
            }));
            const res = (0, mockResponse_1.mockResponse)();
            yield (0, activityController_1.createActivity)(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ _id: 'activity123' });
        }));
    });
    describe('getAllActivities', () => {
        test('should return 200 with activity list', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ query: {} });
            const res = (0, mockResponse_1.mockResponse)();
            activityModel_1.activityModel.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
            yield (0, activityController_1.getAllActivities)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        }));
    });
    describe('getActivityById', () => {
        test('should return 200 with activity', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'activity123' } });
            const res = (0, mockResponse_1.mockResponse)();
            activityModel_1.activityModel.findById.mockResolvedValue({ _id: 'activity123' });
            yield (0, activityController_1.getActivityById)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ _id: 'activity123' });
        }));
    });
    describe('getActivitiesByQuery', () => {
        test('should return 200 with matched activities', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { field: 'title', value: 'Meeting' } });
            const res = (0, mockResponse_1.mockResponse)();
            activityModel_1.activityModel.find.mockResolvedValue([{ title: 'Meeting' }]);
            yield (0, activityController_1.getActivitiesByQuery)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ title: 'Meeting' }]);
        }));
    });
    describe('updateActivityById', () => {
        test('should return 200 when activity is updated', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'activity123' }, body: {} });
            const res = (0, mockResponse_1.mockResponse)();
            activityModel_1.activityModel.findByIdAndUpdate.mockResolvedValue({});
            yield (0, activityController_1.updateActivityById)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Activity updated successfully' });
        }));
        test('should return 404 when activity not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'notexist' }, body: {} });
            const res = (0, mockResponse_1.mockResponse)();
            activityModel_1.activityModel.findByIdAndUpdate.mockResolvedValue(null);
            yield (0, activityController_1.updateActivityById)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Activity not found' });
        }));
    });
    describe('deleteActivityById', () => {
        test('should return 200 when activity is deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'activity123' } });
            const res = (0, mockResponse_1.mockResponse)();
            activityModel_1.activityModel.findByIdAndDelete.mockResolvedValue({});
            yield (0, activityController_1.deleteActivityById)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Activity deleted successfully' });
        }));
        test('should return 404 when activity is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, mockRequest_1.mockRequest)({ params: { id: 'notexist' } });
            const res = (0, mockResponse_1.mockResponse)();
            activityModel_1.activityModel.findByIdAndDelete.mockResolvedValue(null);
            yield (0, activityController_1.deleteActivityById)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Activity not found' });
        }));
    });
});
//# sourceMappingURL=activity.test.js.map