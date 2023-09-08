const Post = require("../database/models/post.model");
const Comment = require("../database/models/comment.model");
const User = require("../database/models/user.model");

// get all existing posts
const getPosts = async (req, res) => {
  const posts = await Post.find({});

  if (posts.length === 0) {
    return res.status(404).json({ error: `No posts existed !` });
  }

  return res.status(200).json({ response: posts });
};

// create one post if it does not exist
const createPost = async (req, res) => {
  const { topic, title, content } = req.body;
  const { userId } = req;

  if (!userId || !topic || !title || !content) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  const post = new Post({
    userId,
    topic,
    title,
    content,
    comments: {},
  });

  await post
    .save()
    .then(async () => {
      return res
        .status(201)
        .json({ response: `Your post has been successfully created !` });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    });
};

// get one existing post
const getPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ postId });

  if (!post) {
    return res.status(404).json({ error: `Post ${postId} does not exist !` });
  }

  return res.status(200).json({ post });
};

// update one existing post
const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { topic, title, content } = req.body;
  const { userId } = req;

  if (!topic || !title || !content) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  const post = await Post.findOne({ postId });

  if (!post) {
    return res.status(404).json({ error: `The post does not exist !` });
  }

  if (post.userId !== userId) {
    return res.status(403).json({
      error: `Permission denied, you cannot update the post of another user !`,
    });
  }

  post.topic = topic;
  post.title = title;
  post.content = content;

  await post.save();

  return res
    .status(200)
    .json({ response: `Post has been successfully updated !` });
};

// delete one post if it exists
const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  const isPostExist = await Post.findOne({ postId });

  if (!isPostExist) {
    return res.status(404).json({ error: `Post ${postId} does not exist !` });
  }

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  if (isPostExist.userId !== userId) {
    return res.status(403).json({
      error: `Permission denied, you cannot delete the post of another user !`,
    });
  }

  const post = await Post.deleteOne({ postId })
    .then(() => {})
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Problem while deleting post !`, err });
    });

  const comments = await Comment.deleteMany({ postId })
    .then(() => {
      return res
        .status(202)
        .json({ response: `The post has been successfully deleted !` });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Problem while deleting post !`, err });
    });
};

// create a like of a post
const createLikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  if (userId !== req.userId) {
    return res
      .status(400)
      .json({ err: `Error occured, you cannot like the post !` });
  }

  const post = await Post.findOne({ postId });

  if (post.likes.includes(userId)) {
    return res.status(500).json({ error: `You already liked the post !` });
  }

  post.likes.push(userId);

  await post
    .save()
    .then(() => {
      return res
        .status(200)
        .json({ response: `You successfully liked the post !` });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ error: `Error occured with the like of the post !` });
    });
};

// delete a like of a post
const deleteLikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  if (userId !== req.userId) {
    return res
      .status(400)
      .json({ err: `Error occured, you cannot unlike the post !` });
  }

  const post = await Post.findOne({ postId });

  if (!post.likes.includes(userId)) {
    return res
      .status(500)
      .json({ error: `You cannot unlike a post you have not liked !` });
  }

  const index = post.likes.indexOf(userId);

  if (index > -1) {
    post.likes.splice(index, 1);
  }

  await post
    .save()
    .then(() => {
      return res
        .status(200)
        .json({ response: `You successfully unliked the post !` });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ error: `Error occured, you cannot unlike the post !` });
    });
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  createLikePost,
  deleteLikePost,
};
