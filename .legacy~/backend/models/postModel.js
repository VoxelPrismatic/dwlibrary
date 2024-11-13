const mongoose = require('mongoose');
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: String,
    transcript: String,
    episode: Number
})
const Post = mongoose.model('Post', postSchema);
module.exports = Post;