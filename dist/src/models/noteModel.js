"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteModel = void 0;
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    date: { type: Date, required: true },
    _createdBy: { type: String, ref: "User", required: true },
});
exports.noteModel = (0, mongoose_1.model)("Note", noteSchema);
//# sourceMappingURL=noteModel.js.map