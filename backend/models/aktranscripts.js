const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aktranscriptSchema = new Schema({
  title: String,
  transcript: String,
  episode: Number
});
const AKTranscript = mongoose.model("AKTranscript", aktranscriptSchema);
module.exports = AKTranscript;
