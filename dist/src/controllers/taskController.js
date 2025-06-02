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
exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
exports.getTaskById = getTaskById;
exports.updateTaskById = updateTaskById;
exports.deleteTaskById = deleteTaskById;
const taskModel_1 = require("../models/taskModel");
/**
 * Create a new task
 */
function createTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const newTask = new taskModel_1.taskModel({
                title: req.body.title,
                isCompleted: (_a = req.body.isCompleted) !== null && _a !== void 0 ? _a : false,
                highPriority: (_b = req.body.highPriority) !== null && _b !== void 0 ? _b : false,
                _createdBy: req.body._createdBy,
            });
            const savedTask = yield newTask.save();
            res.status(201).json(savedTask);
        }
        catch (error) {
            console.error("❌ Failed to create task:", error.message);
            res.status(500).json({
                message: "Failed to create task",
                error: error.message || error,
            });
        }
    });
}
/**
 * Get all tasks (optionally filtered by userId)
 */
function getAllTasks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.query.userId;
            const query = userId ? { _createdBy: userId } : {};
            const tasks = yield taskModel_1.taskModel.find(query).sort({ createdAt: -1 });
            res.status(200).json(tasks);
        }
        catch (error) {
            console.error("❌ Failed to fetch tasks:", error.message);
            res.status(500).json({
                message: "Failed to fetch tasks",
                error: error.message || error,
            });
        }
    });
}
/**
 * Get a task by ID
 */
function getTaskById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const task = yield taskModel_1.taskModel.findById(req.params.id);
            if (!task) {
                res.status(404).json({ message: "Task not found" });
                return;
            }
            res.status(200).json(task);
        }
        catch (error) {
            res.status(500).json({
                message: "Error retrieving task",
                error: error.message || error,
            });
        }
    });
}
/**
 * Update a task by ID
 */
function updateTaskById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedTask = yield taskModel_1.taskModel.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                isCompleted: req.body.isCompleted,
                highPriority: req.body.highPriority,
            }, { new: true });
            if (!updatedTask) {
                res.status(404).json({ message: "Task not found" });
                return;
            }
            res.status(200).json(updatedTask);
        }
        catch (error) {
            res.status(500).json({
                message: "Error updating task",
                error: error.message || error,
            });
        }
    });
}
/**
 * Delete a task by ID
 */
function deleteTaskById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedTask = yield taskModel_1.taskModel.findByIdAndDelete(req.params.id);
            if (!deletedTask) {
                res.status(404).json({ message: "Task not found" });
                return;
            }
            res.status(200).json({ message: "Task deleted successfully" });
        }
        catch (error) {
            res.status(500).json({
                message: "Error deleting task",
                error: error.message || error,
            });
        }
    });
}
//# sourceMappingURL=taskController.js.map