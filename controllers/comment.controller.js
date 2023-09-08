const Post = require("../database/models/post.model");
const Comment = require("../database/models/comment.model");
const User = require("../database/models/user.model");

// get all existing comments from a post
const getCommentsFromPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ postId });

  if (!post) {
    return res.status(404).json({ error: `This post does not exist !` });
  }

  const comments = await Comment.find({ postId });

  if (comments.length === 0) {
    return res
      .status(404)
      .json({ error: `No comments existed for this post !` });
  }

  return res.status(200).json({ response: comments });
};

// create one comment from an existing post
const createCommentFromPost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { userId } = req;

  const post = await Post.findOne({ postId });

  if (!post) {
    return res.status(404).json({ error: `This post does not exist !` });
  }

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  const comment = new Comment({
    postId,
    userId,
    content,
  });

  await comment
    .save()
    .then(async () => {
      post.comments[comment.commentId] = content;
      post.markModified("comments");
      await post.save();

      return res
        .status(201)
        .json({ response: `Your comment has been successfully created !` });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    });
};

// update one comment from an existing post
const updateCommentFromPost = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const { userId } = req;

  if (!content) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const comment = await Comment.findOne({ commentId });

  if (!comment) {
    console.log(`Comment ${commentId} does not exist !`);
    return res.status(404).json({ error: `Comment does not exist !` });
  }

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  if (userId !== comment.userId) {
    return res.status(403).json({
      error: `Permission denied, you cannot edit the comment of another user !`,
    });
  }

  comment.content = content;
  await comment.save();

  const post = await Post.findOne({ postId });

  if (!post) {
    return res.status(404).json({ error: `Problem while editing comment !` });
  }

  post.comments[commentId] = content;
  post.markModified("comments");
  await post.save();

  return res
    .status(200)
    .json({ response: `Comment has been successfully updated !` });
};

// delete one comment from an existing post
const deleteCommentFromPost = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId } = req;

  const isCommentExist = await Comment.findOne({ commentId });

  if (!isCommentExist) {
    return res.status(404).json({ error: `Comment does not exist !` });
  }

  if (isCommentExist.userId !== userId) {
    return res.status(403).json({
      error: `Permission denied, you cannot delete the comment of another user !`,
    });
  }

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  const comment = await Comment.deleteOne({ commentId });

  const post = await Post.findOne({ postId });

  if (!post) {
    return res.status(404).json({ error: `Problem while deleting comment !` });
  }

  delete post.comments[commentId];
  post.markModified("comments");
  await post.save();

  return res
    .status(202)
    .json({ response: `Comment has been successfully deleted !` });
};

// create a like for a comment
const createLikeCommentFromPost = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  if (userId !== req.userId) {
    return res
      .status(400)
      .json({ err: `Error occured, you cannot like the comment !` });
  }

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  const comment = await Comment.findOne({ commentId });

  if (comment.likes.includes(userId)) {
    return res.status(500).json({ error: `You already liked the comment !` });
  }

  comment.likes.push(userId);

  await comment
    .save()
    .then(() => {
      return res
        .status(200)
        .json({ response: `You successfully liked the comment !` });
    })
    .catch(() => {
      return res
        .status(400)
        .json({ error: `Error occured with the like of the comment !` });
    });
};

// delete a like for a comment
const deleteLikeCommentFromPost = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  const isUserExist = await User.findOne({ userId });
  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  if (userId !== req.userId) {
    return res
      .status(400)
      .json({ err: `Error occured, you cannot unlike the comment !` });
  }

  const comment = await Comment.findOne({ commentId });

  if (!comment.likes.includes(userId)) {
    return res
      .status(500)
      .json({ error: `You cannot unlike a comment you have not liked !` });
  }

  const index = comment.likes.indexOf(userId);

  if (index > -1) {
    comment.likes.splice(index, 1);
  }

  await comment
    .save()
    .then(() => {
      return res
        .status(200)
        .json({ response: `You successfully unliked the comment !` });
    })
    .catch(() => {
      return res
        .status(400)
        .json({ error: `Error occured, you cannot unlike the comment !` });
    });
};

module.exports = {
  getCommentsFromPost,
  createCommentFromPost,
  updateCommentFromPost,
  deleteCommentFromPost,
  createLikeCommentFromPost,
  deleteLikeCommentFromPost,
};
