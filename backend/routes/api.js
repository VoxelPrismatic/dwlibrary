const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const Cancelled = require("../models/cancelledModel");
const Transcript = require("../models/transcriptModel");
const Title = require("../models/titleModel");
const Book = require("../models/bookModel");
const MKTitle = require("../models/mktitles");
const MKTranscript = require("../models/mktranscripts");

const ITEMS_PER_PAGE = 100; // Adjust the number of items per page as needed

router.get("/titles", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { episode: { $regex: searchRegex } }
        ]
      };
    }

    const titles = await Title.find(query)
      .sort({ episode: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.send(titles);
  } catch (error) {
    next(error);
  }
});

router.get("/mktitles", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { episode: { $regex: searchRegex } }
        ]
      };
    }

    const titles = await MKTitle.find(query)
      .sort({ episode: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.send(titles);
  } catch (error) {
    next(error);
  }
});

router.get("/posts", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { transcript: { $regex: searchRegex } }
        ]
      };
    }

    const posts = await Post.find(query)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .allowDiskUse(true);

    res.send(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/mktranscripts", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { transcript: { $regex: searchRegex } }
        ]
      };
    }

    const mktranscripts = await MKTranscript.find(query)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .allowDiskUse(true);

    res.send(mktranscripts);
  } catch (error) {
    next(error);
  }
});

router.get("/posts/meta", async function (req, res, next) {
  try {
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { transcript: { $regex: searchRegex } },
          { episode: { $regex: searchRegex } }
        ]
      };
    }

    const totalCount = await Post.countDocuments(query);
    res.json({ totalCount });
    console.log(totalCount);
  } catch (error) {
    next(error);
  }
});

router.get("/mktranscripts/meta", async function (req, res, next) {
  try {
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { transcript: { $regex: searchRegex } },
          { episode: { $regex: searchRegex } }
        ]
      };
    }

    const totalCount = await MKTranscript.countDocuments(query);
    res.json({ totalCount });
    console.log(totalCount);
  } catch (error) {
    next(error);
  }
});

router.get("/posts/:episodeNumber", async function (req, res, next) {
  try {
    const episodeNumber = req.params.episodeNumber;
    const post = await Post.findOne({ episode: episodeNumber });

    if (!post) {
      // Return a 404 status if the episode is not found
      return res.status(404).json({ message: "Episode not found" });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.get("/mktranscripts/:episodeNumber", async function (req, res, next) {
  try {
    const episodeNumber = req.params.episodeNumber;
    const mktranscript = await MKTranscript.findOne({ episode: episodeNumber });

    if (!mktranscript) {
      // Return a 404 status if the episode is not found
      return res.status(404).json({ message: "Episode not found" });
    }

    res.json(mktranscript);
  } catch (error) {
    next(error);
  }
});

router.get("/books", async function (req, res, next) {
  try {
    const books = await Book.find().sort({ episode: -1 }); // Sort by author in ascending order
    res.send(books);
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

router.post("/mktranscripts", async function (req, res, next) {
  try {
    const mktranscripts = await MKTranscript.create(req.body);
    res.send(mktranscripts);
  } catch (error) {
    next(error);
  }
});

router.post("/books", async function (req, res, next) {
  try {
    const books = await Book.create(req.body);
    res.send(books);
  } catch (error) {
    next(error);
  }
});

router.post("/titles", async function (req, res, next) {
  try {
    const titles = await Title.create(req.body);
    res.send(titles);
  } catch (error) {
    next(error);
  }
});
router.post("/mktitles", async function (req, res, next) {
  try {
    const mktitles = await MKTitle.create(req.body);
    res.send(mktitles);
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

router.get("/titles/meta", async function (req, res, next) {
  try {
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { episode: { $regex: searchRegex } }
        ]
      };
    }

    const totalCount = await Title.countDocuments(query);
    console.log("Total Count:", totalCount);

    res.json({ totalCount });
  } catch (error) {
    next(error);
  }
});

router.get("/mktitles/meta", async function (req, res, next) {
  try {
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { episode: { $regex: searchRegex } }
        ]
      };
    }

    const totalCount = await MKTitle.countDocuments(query);
    console.log("Total Count:", totalCount);

    res.json({ totalCount });
  } catch (error) {
    next(error);
  }
});

router.get("/cancelled", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { context: { $regex: searchRegex } },
          { cancelled: { $regex: searchRegex } },
          { Category: { $regex: searchRegex } },
          { episode: { $regex: searchRegex } }
        ]
      };
    } else {
      // If there's no search query, just include Category in the query
      query = { Category: { $exists: true } };
    }

    const cancel = await Cancelled.find(query)
      .sort({ episode: -1 }) // Sort by the "episode" field in ascending order
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.send(cancel);
  } catch (error) {
    next(error);
  }
});

router.get("/cancelled/meta", async function (req, res, next) {
  try {
    const searchQuery = req.query.query || ""; // Get the search query from the request

    let query = {}; // Default to an empty query

    if (searchQuery) {
      // If there's a search query, create a case-insensitive regular expression
      const searchRegex = new RegExp(searchQuery, "i");
      // Apply the search criteria to the query
      query = {
        $or: [
          { context: { $regex: searchRegex } },
          { cancelled: { $regex: searchRegex } },
          { Category: { $regex: searchRegex } } // Include Category in the search
        ]
      };
    } else {
      // If there's no search query, just include Category in the query
      query = { Category: { $exists: true } };
    }

    const totalCount = await Cancelled.countDocuments(query);
    res.json({ totalCount });
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
        { cancelled: { $regex: searchRegex } },
        { episode: { $regex: searchRegex } }
      ];
    }

    const cancel = await Cancelled.find(query)
      .sort({ episode: -1 }) // Sort by the "episode" field in ascending order
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.send(cancel);
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

module.exports = router;
