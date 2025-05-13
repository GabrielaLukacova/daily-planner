import { Schema, model } from "mongoose";
import { Task } from "../interfaces/task";

const taskSchema = new Schema({
  // id: { type: String, required: true },
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  highPriority: { type: Boolean, default: false },
  _createdBy: { type:String, ref: "User", required: true },
});

export const taskModel = model("Task", taskSchema);
