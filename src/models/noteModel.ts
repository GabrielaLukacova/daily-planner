import { Schema, model } from "mongoose";
import { Note } from "../interfaces/note";

const noteSchema = new Schema<Note>({
  // id: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true },
  _createdBy: { type:String, ref: "User", required: true },
});

export const noteModel = model<Note>("Note", noteSchema);