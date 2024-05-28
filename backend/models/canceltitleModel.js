const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cancelTitleSchema = new Schema({
  cancelled: String,
  episode: Number,
  Category: String
});
const cancelTitle = mongoose.model("cancelTitle", cancelTitleSchema);
module.exports = cancelTitle;
