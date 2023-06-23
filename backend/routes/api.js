const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');


router.get('/posts',function(req,res,next){
    Post.find({}).then(function(posts){
        res.send(posts);
    }).catch(next);
});

router.post('/posts',function(req,res,next){
    Post.create(req.body).then(function(posts){
        res.send(posts);
    }).catch(next);

});

module.exports = router