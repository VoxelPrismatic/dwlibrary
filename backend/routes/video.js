const express = require("express");
const router = express.Router();
const Video = require("../models/videoModel");

// Get all videos
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single video by ID
router.get("/videos/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new video
router.post("/videos", async (req, res) => {
  // Check if req.body is an array
  if (Array.isArray(req.body)) {
    try {
      const videos = await Video.insertMany(req.body); // Use insertMany to handle batch inserts
      res.status(201).json(videos);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    const { description, url, host, xlink, xusername } = req.body;
    const video = new Video({
      description,
      url,
      host,
      xlink,
      xusername
    });

    try {
      const newVideo = await video.save();
      res.status(201).json(newVideo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});

// Update an existing video by ID

// Delete a video by ID
router.delete("/videos/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    await video.remove();
    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
