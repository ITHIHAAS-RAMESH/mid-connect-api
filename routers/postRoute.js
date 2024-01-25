const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");

// Get user posts
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send({ msg: "missing required fields" });
  }
  const user = await User.findOne({ _id: userId })
    .then(async (user) => {
      const posts = await Post.find({ userId: user._id });
      res.status(200).send(posts);
    })
    .catch((err) => {
      res.status(500).send({ msg: "user not found" });
    });
});

//get all posts

router.get("/all", async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate("userId")
    .exec();
  if (posts) {
    res.status(200).send(posts);
  } else {
    res.status(404).send({ msg: "server error" });
  }
});

// Create a post
router.post("/", async (req, res) => {
  const { userId, title, img } = req.body;
  if (!userId || !title) {
    res.status(400).json({ message: "Missing required fields" });
  } else {
    const newPost = await Post.create({ userId, title, img });
    if (newPost) {
      console.log("new post has been created");
      res.status(200).send(newPost);
    } else {
      console.log({ message: "Error" });
      res.status(500).json({ message: "Error" });
    }
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  if (!postId) {
    res.status(400).json({ message: "Missing required fields" });
  } else {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (deletedPost) {
      res.status(200).send(deletedPost);
    } else {
      res.status(500).json({ message: "Error" });
    }
  }
});

module.exports = router;
