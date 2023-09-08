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

router.get(`/:postId/comments`, authAuthorization, getCommentsFromPost);

router.post(`/:postId/comments`, authAuthorization, createCommentFromPost);

router.put(
  `/:postId/comments/:commentId`,
  authAuthorization,
  updateCommentFromPost
);

router.delete(
  `/:postId/comments/:commentId`,
  authAuthorization,
  deleteCommentFromPost
);

router.put(
  `/:postId/comments/:commentId/like`,
  authAuthorization,
  createLikeCommentFromPost
);

router.put(
  `/:postId/comments/:commentId/unlike`,
  authAuthorization,
  deleteLikeCommentFromPost
);

module.exports = router;
