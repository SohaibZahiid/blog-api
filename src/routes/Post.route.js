const express = require("express");
const router = express.Router();

const {
  getPosts,
  getSinglePost,
  deletePost,
  createPost,
  updatePost,
} = require("../controllers/Post.controller");

router.get("/", getPosts);
router.get("/:id", getSinglePost);
router.delete("/:id", deletePost);
router.post("/create", createPost);
router.put("/:id", updatePost);

module.exports = router;
