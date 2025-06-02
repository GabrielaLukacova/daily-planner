"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskModel = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    highPriority: { type: Boolean, default: false },
    _createdBy: { type: String, ref: "User", required: true },
}, {
    timestamps: true,
});
exports.taskModel = (0, mongoose_1.model)("Task", taskSchema);
//# sourceMappingURL=taskModel.js.map