const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const Cancelled = require('../models/cancelledModel');


router.get('/posts',function(req,res,next){
    Post.find({}).then(function(posts){
        res.send(posts);
    }).catch(next);
});

router.get('/cancelled',function(req,res,next){
    Cancelled.find({}).then(function(cancel){
        res.send(cancel);
    }).catch(next);
});

router.post('/cancelled',function(req,res,next){
    Cancelled.create(req.body).then(function(cancel){
        res.send(cancel);
    }).catch(next);
});


router.post('/posts',function(req,res,next){
    Post.create(req.body).then(function(posts){
        res.send(posts);
    }).catch(next);
});

module.exports = router