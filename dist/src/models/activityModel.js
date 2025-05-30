"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityModel = void 0;
const mongoose_1 = require("mongoose");
const activity_1 = require("../interfaces/activity");
const activitySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    place: { type: String, required: false },
    isRepeating: { type: Boolean, required: false },
    repeating: {
        type: String,
        enum: Object.values(activity_1.repeatingType),
        default: activity_1.repeatingType.None,
    },
    _createdBy: { type: String, ref: "User", required: true },
});
exports.activityModel = (0, mongoose_1.model)("Activity", activitySchema);
//# sourceMappingURL=activityModel.js.map