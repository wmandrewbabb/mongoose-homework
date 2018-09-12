const mongoose = require('mongoose');
const uniqueValidate = require('mongoose-unique-validator');

// article schemas
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        unique: true,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note",
        required: false
    }]
    });

// plugin to for Mongoose to make sure things are unique and we don't duplicate articles
// using the article URL to test uniqueness

ArticleSchema.plugin(uniqueValidate);

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;