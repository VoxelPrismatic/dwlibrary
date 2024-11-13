const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aktitleSchema = new Schema({
  title: String,
  episode: Number
});
const AKTitle = mongoose.model("AKTitle", aktitleSchema);
module.exports = AKTitle;
