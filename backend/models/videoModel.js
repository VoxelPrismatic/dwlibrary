const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  },
  xlink: {
    type: String,
    required: false
  },
  xusername: {
    type: String,
    required: false
  }
});

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
