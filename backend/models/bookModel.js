const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  author: String,
  description: String,
  coverimage: String,
  episode: Number
});
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
