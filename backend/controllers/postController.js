const Post = require('../models/postModel');
const main = require('../app');

//creat post
exports.createPost = async(req, res, next) => {
    const { title, transcript, episodeNumber } = req.body;
    const post = await Post.create({
        title,
        transcript,
        episodeNumber
    });
    res.status(201).json({
        success: true,
        post
    })
}   