const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const Cancelled = require("../models/cancelledModel");
const Transcript = require("../models/transcriptModel");

const ITEMS_PER_PAGE = 100; // Adjust the number of items per page as needed

router.get("/cancelled", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.query || "";

    let query = {};

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query = {
        $or: [
          { context: { $regex: searchRegex } },
          { cancelled: { $regex: searchRegex } },
          { Category: { $regex: searchRegex } } // Add Category filter
        ]
      };
    } else {
      query = { Category: { $exists: true } }; // Only return items with Category
    }

    const cancel = await Cancelled.find(query)
      .sort({ episode: 1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.send(cancel);
  } catch (error) {
    next(error);
  }
});

router.get("/cancelled/:category", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.query || ""; // Get the search query from the request
    const category = req.params.category || ""; // Get the category parameter from the URL

    let query = { Category: category }; // Default to the specified category

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query.$or = [
        { context: { $regex: searchRegex } },
        { cancelled: { $regex: searchRegex } }
      ];
    }

    const cancel = await Cancelled.find(query)
      .sort({ episode: 1 }) // Sort by the "episode" field in ascending order
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.send(cancel);
  } catch (error) {
    next(error);
  }
});

router.get("/cancelled/meta", async function (req, res, next) {
  try {
    const searchQuery = req.query.query || "";

    let query = {};

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query = {
        $or: [
          { context: { $regex: searchRegex } },
          { cancelled: { $regex: searchRegex } },
          { Category: { $regex: searchRegex } } // Add Category filter
        ]
      };
    } else {
      query = { Category: { $exists: true } }; // Only return items with Category
    }

    const totalCount = await Cancelled.countDocuments(query);
    res.json({ totalCount });
  } catch (error) {
    next(error);
  }
});

router.get("/posts", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skippedItems = (page - 1) * ITEMS_PER_PAGE;

    const posts = await Post.find({}).skip(skippedItems).limit(ITEMS_PER_PAGE);

    res.send(posts);
  } catch (error) {
    next(error);
  }
});

router.post("/cancelled", async function (req, res, next) {
  try {
    const cancel = await Cancelled.create(req.body);
    res.send(cancel);
  } catch (error) {
    next(error);
  }
});

router.post("/posts", async function (req, res, next) {
  try {
    const posts = await Post.create(req.body);
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

router.post("/transcripts", async function (req, res, next) {
  try {
    const transcript = await Transcript.create(req.body);
    res.send(transcript);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
