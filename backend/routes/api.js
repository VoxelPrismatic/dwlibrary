const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const Cancelled = require('../models/cancelledModel');
const Transcript = require('../models/transcriptModel');



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

router.post('/transcripts',function(req,res,next){
    Transcript.create(req.body).then(function(transcript){
        res.send(transcript);
    }).catch(next);
});


// router.delete('/posts',function(req,res,next){
//     Post.create(req.body).then(function(posts){
//         res.send(posts);
//     }).catch(next);
// });

module.exports = router