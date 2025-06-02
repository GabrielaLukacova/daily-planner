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
exports.createActivity = createActivity;
exports.getAllActivities = getAllActivities;
exports.getActivityById = getActivityById;
exports.getActivitiesByQuery = getActivitiesByQuery;
exports.updateActivityById = updateActivityById;
exports.deleteActivityById = deleteActivityById;
const activityModel_1 = require("../models/activityModel");
const database_1 = require("../repository/database");
/**
 * Create a new activity
 */
function createActivity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const newActivity = new activityModel_1.activityModel({
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                place: req.body.place,
                isRepeating: req.body.isRepeating,
                repeating: req.body.repeating,
                _createdBy: req.body._createdBy,
            });
            const savedActivity = yield newActivity.save();
            res.status(201).json(savedActivity);
        }
        catch (error) {
            console.error("❌ Failed to create activity:", error);
            res.status(500).json({
                message: 'Failed to create activity',
                error: error.message || error,
            });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Get all activities
 */
function getAllActivities(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const userId = req.query.userId;
            const query = userId ? { _createdBy: userId } : {};
            const result = yield activityModel_1.activityModel.find(query).sort({ date: -1 });
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ Failed to retrieve activities:", error);
            res.status(500).json({
                message: "Error retrieving activities",
                error: error.message || error,
            });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Get specific activity by ID
 */
function getActivityById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const result = yield activityModel_1.activityModel.findById(req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ Failed to retrieve activity by ID:", error);
            res.status(500).json({
                message: "Error retrieving activity",
                error: error.message || error,
            });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Search activities by field and value
 */
function getActivitiesByQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const field = req.params.field;
        const value = req.params.value;
        try {
            yield (0, database_1.connect)();
            const result = yield activityModel_1.activityModel.find({
                [field]: { $regex: value, $options: 'i' },
            });
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ Failed to query activities:", error);
            res.status(500).json({
                message: "Error querying activities",
                error: error.message || error,
            });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Update activity by ID
 */
function updateActivityById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            yield (0, database_1.connect)();
            const result = yield activityModel_1.activityModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            if (!result) {
                res.status(404).json({ message: 'Activity not found' });
            }
            else {
                res.status(200).json({ message: 'Activity updated successfully' });
            }
        }
        catch (error) {
            console.error("❌ Failed to update activity:", error);
            res.status(500).json({
                message: "Error updating activity",
                error: error.message || error,
            });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Delete activity by ID
 */
function deleteActivityById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            yield (0, database_1.connect)();
            const result = yield activityModel_1.activityModel.findByIdAndDelete(id);
            if (!result) {
                res.status(404).json({ message: 'Activity not found' });
            }
            else {
                res.status(200).json({ message: 'Activity deleted successfully' });
            }
        }
        catch (error) {
            console.error("❌ Failed to delete activity:", error);
            res.status(500).json({
                message: "Error deleting activity",
                error: error.message || error,
            });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
//# sourceMappingURL=activityController.js.map