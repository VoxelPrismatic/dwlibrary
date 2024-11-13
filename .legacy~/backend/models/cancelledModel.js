const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cancelSchema = new Schema({
  cancelled: String,
  context: String,
  episode: Number,
  Category: String
});
const Cancelled = mongoose.model("Cancelled", cancelSchema);
module.exports = Cancelled;
