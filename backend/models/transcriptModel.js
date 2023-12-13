const mongoose = require('mongoose');
const Schema = mongoose.Schema

const transcriptSchema = new Schema({
    title: String,
    transcript: String,
    episode: Number
})
const Transcript = mongoose.model('Transcript', transcriptSchema);
module.exports = Transcript;