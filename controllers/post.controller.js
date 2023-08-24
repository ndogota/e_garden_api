const Post = require("../database/models/post.model");
const Comment = require("../database/models/comment.model");

// get all existing posts
const getPosts = async (req, res) => {
  const posts = await Post.find({});

  if (posts.length === 0) {
    console.log(`No posts existed !`);
    return res.status(404).json({ error: `No posts existed !` });
  }

  console.log(`List of posts : ${posts}`);
  return res.status(200).json({ response: posts });
};

// create one post if it does not exist
const createPost = async (req, res) => {
  const { topic, title, content } = req.body;
  const userId = req.session.userId;

  if (!userId || !topic || !title || !content) {
    return res.status(400).json({ error: `Please fill in all fields !` });
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
      console.log(
        `New post ${post.postId} has been successfully created by user ${userId} !`
      );

      return res
        .status(201)
        .json({ response: `Your post has been successfully created !` });
    })
    .catch((err) => {
      if (err) {
        console.log(`Error post creation :`, err);
        return res.status(500).json({ error: err });
      }
    });
};

// get one existing post
const getPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ postId });

  if (!post) {
    console.log(`Post ${postId} does not exist !`);
    return res.status(404).json({ error: `Post ${postId} does not exist !` });
  }

  console.log(`Post ${postId} :`, post);
  return res.status(200).json({ post });
};

// update one existing post
const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { topic, title, content } = req.body;
  const { userId } = req.session;

  if (!topic || !title || !content) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const post = await Post.findOne({ postId });

  if (!post) {
    console.log(
      `The user ${userId} wants to update the post ${postId} but does not exist !`
    );
    return res.status(404).json({ error: `The post does not exist !` });
  }

  if (post.userId !== userId) {
    console.log(
      `User ${userId} wants to update the post ${postId} but it was created by user ${post.userId} !`
    );
    return res.status(403).json({
      error: `Permission denied, you cannot update the post of another user !`,
    });
  }

  post.topic = topic;
  post.title = title;
  post.content = content;

  await post.save();

  console.log(
    `The post ${postId} has been successfully updated by user ${userId}`
  );

  return res
    .status(200)
    .json({ response: `Post has been successfully updated !` });
};

// delete one post if it exists
const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.session;
  const isPostExist = await Post.findOne({ postId });

  if (!isPostExist) {
    console.log(`Post ${postId} does not exist !`);
    return res.status(404).json({ error: `Post ${postId} does not exist !` });
  }

  if (isPostExist.userId !== userId) {
    console.log(
      `User ${userId} wants to delete the post ${postId} but it was created by user ${isPostExist.userId} !`
    );
    return res.status(403).json({
      error: `Permission denied, you cannot delete the post of another user !`,
    });
  }

  const post = await Post.deleteOne({ postId })
    .then(() => {
      console.log(
        `Post ${postId} and its comments have been successfully deleted !`
      );
    })
    .catch((err) => {
      console.log(`Problem while deleting post !`, err);

      return res
        .status(500)
        .json({ error: `Problem while deleting post !`, err });
    });

  const comments = await Comment.deleteMany({ postId })
    .then(() => {
      console.log(
        `All comments from the post ${postId} have been successfully deleted !`
      );

      return res
        .status(202)
        .json({ response: `The post has been successfully deleted !` });
    })
    .catch((err) => {
      console.log(`Problem while deleting post !`, err);

      return res
        .status(500)
        .json({ error: `Problem while deleting post !`, err });
    });
};

// create a like of a post
const createLikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  if (userId !== req.session.userId) {
    console.log(
      `Error occured, user ${req.session.userId} cannot like the post ${postId} !`
    );
    return res
      .status(400)
      .json({ err: `Error occured, you cannot like the post !` });
  }

  const post = await Post.findOne({ postId });

  if (post.likes.includes(userId)) {
    console.log(`User ${userId} has already liked the post ${postId}`);

    return res.status(500).json({ error: `You already liked the post !` });
  }

  post.likes.push(userId);

  await post
    .save()
    .then(() => {
      console.log(`User ${userId} has successfully liked the post ${postId}`);

      return res
        .status(200)
        .json({ response: `You successfully liked the post !` });
    })
    .catch((err) => {
      console.log(`Error occured with the like of the post ${postId} !`, err);

      return res
        .status(400)
        .json({ error: `Error occured with the like of the post !` });
    });
};

// delete a like of a post
const deleteLikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  if (userId !== req.session.userId) {
    console.log(
      `Error occured, user ${req.session.userId} cannot unlike the post ${postId} !`
    );
    return res
      .status(400)
      .json({ err: `Error occured, you cannot unlike the post !` });
  }

  const post = await Post.findOne({ postId });

  if (!post.likes.includes(userId)) {
    console.log(`User ${userId} cannot unlike the post ${postId} !`);

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
      console.log(`User ${userId} has successfully unliked the post ${postId}`);

      return res
        .status(200)
        .json({ response: `You successfully unliked the post !` });
    })
    .catch((err) => {
      console.log(
        `Error occured, user ${userId} cannot unlike the post ${postId} !`,
        err
      );

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
