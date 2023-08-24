const express = require("express");
const router = express.Router();

const {
  getCommentsFromPost,
  createCommentFromPost,
  updateCommentFromPost,
  deleteCommentFromPost,
  createLikeCommentFromPost,
  deleteLikeCommentFromPost,
} = require("../../../controllers/comment.controller");

const { authAuthorization } = require("../../../middlewares/auth.middleware");

router.get(`/posts/:postId/comments`, authAuthorization, getCommentsFromPost);

router.post(
  `/posts/:postId/comments`,
  authAuthorization,
  createCommentFromPost
);

router.put(
  `/posts/:postId/comments/:commentId`,
  authAuthorization,
  updateCommentFromPost
);

router.delete(
  `/posts/:postId/comments/:commentId`,
  authAuthorization,
  deleteCommentFromPost
);

router.put(
  `/posts/:postId/comments/:commentId/like`,
  authAuthorization,
  createLikeCommentFromPost
);

router.put(
  `/posts/:postId/comments/:commentId/unlike`,
  authAuthorization,
  deleteLikeCommentFromPost
);

module.exports = router;
