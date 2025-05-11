import { Schema, model } from "mongoose";
import { Task } from "../interfaces/task";

const taskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  highPriority: { type: Boolean, default: false }
});

export const taskModel = model("Task", taskSchema);
