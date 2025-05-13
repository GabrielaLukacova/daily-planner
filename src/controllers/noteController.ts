import { Request, Response } from 'express';
import { noteModel } from '../models/noteModel';
import { connect, disconnect } from '../repository/database';

  /**
   * Create a new note
   */
  export async function createNote(req: Request, res: Response) {
    try {
      const newNote = new noteModel({
        userId: req.body.userId,
        text: req.body.title,
        date: req.body.date,
        _createdBy: req.body._createdBy,
      });
      const savedNote = await newNote.save();
      res.status(201).json(savedNote);
    } catch (error: any) {
      console.error("Failed to create note:", error.message);
      res.status(500).json({
        message: "Failed to create note",
        error: error.message || error,
      });
    }
  }

/**
 * Get all notes
 */
export async function getAllNotes(req: Request, res: Response) {
  try {
    await connect();
    const result = await noteModel.find({});
    res.status(200).send(result);
  } catch {
    res.status(500).send("Error retrieving notes.");
  } finally {
    await disconnect();
  }
}

/**
 * Get note by ID
 */
export async function getNoteById(req: Request, res: Response) {
  try {
    await connect();
    const result = await noteModel.findById(req.params.id);
    res.status(200).send(result);
  } catch {
    res.status(500).send("Error retrieving note with id=" + req.params.id);
  } finally {
    await disconnect();
  }
}



/**
 * Search note by field and value
 */
export async function getNotesByQuery(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;

  try {
    await connect();
    const result = await noteModel.find({ [field]: { $regex: value, $options: 'i' } });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving notes. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Update note by ID
 */
export async function updateNoteById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await connect();
    const result = await noteModel.findByIdAndUpdate(id, req.body);
    if (!result) {
      res.status(404).send('Cannot update note with id=' + id);
    } else {
      res.status(200).send('Note was successfully updated.');
    }
  } catch {
    res.status(500).send('Error updating note with id=' + id);
  } finally {
    await disconnect();
  }
}

/**
 * Delete note by ID
 */
export async function deleteNoteById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await connect();
    const result = await noteModel.findByIdAndDelete(id);
    if (!result) {
      res.status(404).send('Cannot delete note with id=' + id);
    } else {
      res.status(200).send('Note was successfully deleted.');
    }
  } catch {
    res.status(500).send('Error deleting note with id=' + id);
  } finally {
    await disconnect();
  }
}
