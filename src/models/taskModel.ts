import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    highPriority: { type: Boolean, default: false },
    _createdBy: { type: String, ref: "User", required: true },
  },
  {
    timestamps: true, // 👈 Dette legger til createdAt og updatedAt automatisk
  }
);

export const taskModel = model("Task", taskSchema);
