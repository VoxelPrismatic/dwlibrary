const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const backstagetranscriptSchema = new Schema({
  title: String,
  transcript: String,
  episode: Number
});
const BackstageTranscript = mongoose.model(
  "BackstageTranscript",
  backstagetranscriptSchema
);
module.exports = BackstageTranscript;
