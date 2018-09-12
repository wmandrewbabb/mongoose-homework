const mongoose = require('mongoose');
const uniqueValidate = require('mongoose-unique-validator');

// schemas for notes
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// plugin to for Mongoose to make sure things are unique
NoteSchema.plugin(uniqueValidate);

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;