import { Schema, model } from "mongoose";
import { Activity, repeatingType } from "../interfaces/activity";

const activitySchema = new Schema<Activity>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    place: { type: String, required: true },
    isRepeating: { type: Boolean, required: true },
    repeating: {
        type: String,
        enum: Object.values(repeatingType),
        default: repeatingType.None,
    },
    _createdBy: { type: String, ref: "User", required: true },
});

export const activityModel = model<Activity>("Activity", activitySchema);