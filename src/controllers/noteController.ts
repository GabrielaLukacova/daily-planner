import { Request, Response } from 'express';
import { noteModel } from '../models/noteModel';
import { connect, disconnect } from '../repository/database';

/**
 * Create a new note
 */
export async function createNote(req: Request, res: Response) {
  try {
    await connect();

    const newNote = new noteModel({
      text: req.body.text,
      date: req.body.date,
      _createdBy: req.body._createdBy,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error: any) {
    console.error('❌ Failed to create note:', error.message);
    res.status(500).json({
      message: 'Failed to create note',
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}

/**
 * Get all notes or note for a specific user and date
 */
export async function getAllNotes(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    const userId = req.query.userId as string | undefined;
    const date = req.query.date as string | undefined;

    if (!userId) {
      res.status(400).json({ message: 'Missing userId in query' });
      return;
    }

    const query: any = { _createdBy: userId };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.date = { $gte: start, $lte: end };
    }

    const result = await noteModel.find(query).sort({ date: -1 });
    res.status(200).json(result); // ✅ ikke "return" her
  } catch (error: any) {
    console.error('❌ Failed to retrieve notes:', error.message);
    res.status(500).json({
      message: 'Error retrieving notes',
      error: error.message || error,
    });
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
    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Failed to get note by ID:', error);
    res.status(500).send('Error retrieving note with id=' + req.params.id);
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
    const result = await noteModel.find({
      [field]: { $regex: value, $options: 'i' },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Failed to query notes:', error);
    res.status(500).send('Error retrieving notes. Error: ' + error);
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
    const result = await noteModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      res.status(404).send('Cannot update note with id=' + id);
    } else {
      res.status(200).send('Note was successfully updated.');
    }
  } catch (error) {
    console.error('❌ Failed to update note:', error);
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
  } catch (error) {
    console.error('❌ Failed to delete note:', error);
    res.status(500).send('Error deleting note with id=' + id);
  } finally {
    await disconnect();
  }
}
