const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mktranscriptSchema = new Schema({
  title: String,
  transcript: String,
  episode: Number
});
const MKTranscript = mongoose.model("MKTranscript", mktranscriptSchema);
module.exports = MKTranscript;
