const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const titleSchema = new Schema({
  title: String,
  episode: Number
});
const Title = mongoose.model("Title", titleSchema);
module.exports = Title;
