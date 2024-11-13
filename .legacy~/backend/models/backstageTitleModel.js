const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const backstagetitleSchema = new Schema({
  title: String,
  episode: Number
});
const BackstageTitle = mongoose.model("BackstageTitle", backstagetitleSchema);
module.exports = BackstageTitle;
