const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mktitleSchema = new Schema({
  title: String,
  episode: Number
});
const MKTitle = mongoose.model("MKTitle", mktitleSchema);
module.exports = MKTitle;
