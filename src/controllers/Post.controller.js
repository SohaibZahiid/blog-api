const Post = require("../models/Post.model");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

const getPosts = async (req, res) => {
  const { cat, author } = req.query;
  const queryObject = {};

  if (cat) {
    queryObject.cat = cat;
  }

  if (author) {
    queryObject.author = author;
  }

  const posts = await Post.find(queryObject);
  res.status(200).json(posts);
};

const getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username img"
  );
  res.status(200).json(post);
};

const deletePost = async (req, res) => {
  const token = req.cookies.access_token;
  // Check if token was passed in
  if (!token) {
    return res.status(401).json("No token provided");
  }
  // Finds post by id provided
  const post = await Post.findById(req.params.id);
  // Check if post exists by id provided
  if (!post) {
    return res.status(404).json("Post not found");
  }
  // Decodes token from cookie and checks if it's valid
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Check if user is the author of the post
  if (post.author.toString() !== decoded) {
    return res.status(401).json("You can only delete your own post");
  }
  // Deletes post
  await post.deleteOne();
  // Deletes post id from user's posts array
  const user = await User.findById(post.author.toString());
  user.posts.pull(post._id);
  await user.save();

  res.status(200).json("Post deleted successfully");
};

const createPost = (req, res) => {
  const token = req.cookies.access_token;
  console.log(JSON.stringify(req.cookies));
  if (!token) {
    return res.status(401).json("You are not authorized");
  }

  let { title, desc, img, cat } = req.body;

  if (!img) {
    img =
      "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json("You are not authorized");
    }

    const newPost = new Post({
      title: title,
      desc: desc,
      img: img,
      cat: cat,
      author: decoded,
    });
    await newPost.save();

    const user = await User.findById(decoded);
    user.posts.push(newPost._id);
    await user.save();

    res.status(201).json("Post has been created successfully");
  });
};

const updatePost = async (req, res) => {
  const token = req.cookies.access_token;
  // Check if token was passed in
  if (!token) {
    return res.status(401).json("No token provided");
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json("Post not found");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (post.author.toString() !== decoded) {
    return res.status(401).json("You can only update your own post");
  }

  if (req.body.title) {
    post.title = req.body.title;
  }

  if (req.body.desc) {
    post.desc = req.body.desc;
  }

  if (req.body.img) {
    post.img = req.body.img;
  }

  if (req.body.cat) {
    post.cat = req.body.cat;
  }

  await post.save();

  res.status(200).json("Post updated successfully");
};

const getPostsByUser = async (req, res) => {
  const posts = await Post.find({ author: req.query.id });
  res.status(200).json(posts);
};

module.exports = {
  getPosts,
  getSinglePost,
  getPostsByUser,
  deletePost,
  createPost,
  updatePost,
};
