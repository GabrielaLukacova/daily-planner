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
exports.createNote = createNote;
exports.getAllNotes = getAllNotes;
exports.getNoteById = getNoteById;
exports.getNotesByQuery = getNotesByQuery;
exports.updateNoteById = updateNoteById;
exports.deleteNoteById = deleteNoteById;
const noteModel_1 = require("../models/noteModel");
const database_1 = require("../repository/database");
/**
 * Create a new note
 */
function createNote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const newNote = new noteModel_1.noteModel({
                text: req.body.text,
                date: req.body.date,
                _createdBy: req.body._createdBy,
            });
            const savedNote = yield newNote.save();
            res.status(201).json(savedNote);
        }
        catch (error) {
            console.error("❌ Failed to create note:", error.message);
            res.status(500).json({
                message: "Failed to create note",
                error: error.message || error,
            });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Get all notes (optionally filtered by userId)
 */
function getAllNotes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const userId = req.query.userId;
            const query = userId ? { _createdBy: userId } : {};
            const result = yield noteModel_1.noteModel.find(query).sort({ date: -1 }); // newest first
            res.status(200).send(result);
        }
        catch (error) {
            console.error("❌ Failed to retrieve notes:", error);
            res.status(500).send("Error retrieving notes.");
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Get note by ID
 */
function getNoteById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const result = yield noteModel_1.noteModel.findById(req.params.id);
            res.status(200).send(result);
        }
        catch (error) {
            console.error("❌ Failed to get note by ID:", error);
            res.status(500).send("Error retrieving note with id=" + req.params.id);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Search note by field and value
 */
function getNotesByQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const field = req.params.field;
        const value = req.params.value;
        try {
            yield (0, database_1.connect)();
            const result = yield noteModel_1.noteModel.find({
                [field]: { $regex: value, $options: 'i' },
            });
            res.status(200).send(result);
        }
        catch (error) {
            console.error("❌ Failed to query notes:", error);
            res.status(500).send("Error retrieving notes. Error: " + error);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Update note by ID
 */
function updateNoteById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            yield (0, database_1.connect)();
            const result = yield noteModel_1.noteModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!result) {
                res.status(404).send('Cannot update note with id=' + id);
            }
            else {
                res.status(200).send('Note was successfully updated.');
            }
        }
        catch (error) {
            console.error("❌ Failed to update note:", error);
            res.status(500).send('Error updating note with id=' + id);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Delete note by ID
 */
function deleteNoteById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            yield (0, database_1.connect)();
            const result = yield noteModel_1.noteModel.findByIdAndDelete(id);
            if (!result) {
                res.status(404).send('Cannot delete note with id=' + id);
            }
            else {
                res.status(200).send('Note was successfully deleted.');
            }
        }
        catch (error) {
            console.error("❌ Failed to delete note:", error);
            res.status(500).send('Error deleting note with id=' + id);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
//# sourceMappingURL=noteController.js.map