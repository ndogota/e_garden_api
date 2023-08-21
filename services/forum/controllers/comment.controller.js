const Post = require("../database/models/post.model");
const Comment = require("../database/models/comment.model");

// get all existing comments from a post
const getCommentsFromPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ postId });

  if (!post) {
    console.log(`The post ${postId} does not exist !`);
    return res.status(404).json({ error: `This post does not exist !` });
  }

  const comments = await Comment.find({ postId });

  if (comments.length === 0) {
    console.log(`No comments existed !`);
    return res
      .status(404)
      .json({ error: `No comments existed for this post !` });
  }

  console.log(`List of comments : ${comments}`);
  return res.status(200).json({ response: comments });
};

// create one comment from an existing post
const createCommentFromPost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { userId } = req.session;

  const post = await Post.findOne({ postId });

  if (!post) {
    console.log(`The post ${postId} does not exist !`);
    return res.status(404).json({ error: `This post does not exist !` });
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

      console.log(
        `New comment ${comment.commentId} has been successfully created for post ${postId} by user ${userId} !`
      );

      console.log(
        `The comment ${comment.commentId} from the post ${postId} has been successfully created by user ${userId}`
      );

      return res
        .status(201)
        .json({ response: `Your comment has been successfully created !` });
    })
    .catch((err) => {
      if (err) {
        console.log(`Error comment creation for user ${userId} :`, err);
        return res.status(500).json({ error: err });
      }
    });
};

// update one comment from an existing post
const updateCommentFromPost = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const { userId } = req.session;

  if (!content) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const comment = await Comment.findOne({ commentId });

  if (!comment) {
    console.log(`Comment ${commentId} does not exist !`);
    return res.status(404).json({ error: `Comment does not exist !` });
  }

  if (userId !== comment.userId) {
    console.log(
      `User ${userId} wants to modify the comment ${commentId} but it was created by user ${comment.userId} !`
    );
    return res.status(403).json({
      error: `Permission denied, you cannot edit the comment of another user !`,
    });
  }

  comment.content = content;
  await comment.save();

  const post = await Post.findOne({ postId });

  if (!post) {
    console.log(
      `User ${userId} has problem with editing comment ${commentId} of the post ${postId} !`
    );
    return res.status(404).json({ error: `Problem while editing comment !` });
  }

  post.comments[commentId] = content;
  post.markModified("comments");
  await post.save();

  console.log(
    `Comment ${commentId} has been successfully updated by ${userId} !`
  );

  console.log(
    `The comment ${commentId} from the post ${postId} has been successfully updated by user ${userId}`
  );

  return res
    .status(200)
    .json({ response: `Comment has been successfully updated !` });
};

// delete one comment from an existing post
const deleteCommentFromPost = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId } = req.session;

  const isCommentExist = await Comment.findOne({ commentId });

  if (!isCommentExist) {
    console.log(`Comment ${commentId} does not exist !`);
    return res.status(404).json({ error: `Comment does not exist !` });
  }

  if (isCommentExist.userId !== userId) {
    console.log(
      `User ${userId} wants to delete the comment ${commentId} but it was created by user ${isCommentExist.userId} !`
    );
    return res.status(403).json({
      error: `Permission denied, you cannot delete the comment of another user !`,
    });
  }

  const comment = await Comment.deleteOne({ commentId });

  const post = await Post.findOne({ postId });

  if (!post) {
    console.log(
      `User ${userId} has problem with deleting comment ${commentId} of the post ${postId} !`
    );
    return res.status(404).json({ error: `Problem while deleting comment !` });
  }

  delete post.comments[commentId];
  post.markModified("comments");
  await post.save();

  console.log(
    `Comment ${commentId} has been successfully deleted by ${userId} !`
  );

  console.log(
    `The comment ${commentId} from the post ${postId} has been successfully deleted by user ${userId} !`
  );

  return res
    .status(202)
    .json({ response: `Comment has been successfully deleted !` });
};

// create a like for a comment
const createLikeCommentFromPost = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  if (userId !== req.session.userId) {
    console.log(
      `Error occured, user ${req.session.userId} cannot like the comment ${commentId} !`
    );
    return res
      .status(400)
      .json({ err: `Error occured, you cannot like the comment !` });
  }

  const comment = await Comment.findOne({ commentId });

  if (comment.likes.includes(userId)) {
    console.log(`User ${userId} has already liked the comment ${commentId}`);

    return res.status(500).json({ error: `You already liked the comment !` });
  }

  comment.likes.push(userId);

  await comment
    .save()
    .then(() => {
      console.log(
        `User ${userId} has successfully liked the comment ${commentId}`
      );

      return res
        .status(200)
        .json({ response: `You successfully liked the comment !` });
    })
    .catch((err) => {
      console.log(
        `Error occured with the like of the comment ${commentId} !`,
        err
      );

      return res
        .status(400)
        .json({ error: `Error occured with the like of the comment !` });
    });
};

// delete a like for a comment
const deleteLikeCommentFromPost = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  if (userId !== req.session.userId) {
    console.log(
      `Error occured, user ${req.session.userId} cannot unlike the comment ${commentId} !`
    );
    return res
      .status(400)
      .json({ err: `Error occured, you cannot unlike the comment !` });
  }

  const comment = await Comment.findOne({ commentId });

  if (!comment.likes.includes(userId)) {
    console.log(`User ${userId} cannot unlike the comment ${commentId} !`);

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
      console.log(
        `User ${userId} has successfully unliked the comment ${commentId}`
      );

      return res
        .status(200)
        .json({ response: `You successfully unliked the comment !` });
    })
    .catch((err) => {
      console.log(
        `Error occured, user ${userId} cannot unlike the comment ${commentId} !`,
        err
      );

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
