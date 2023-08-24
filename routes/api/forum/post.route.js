const express = require("express");
const router = express.Router();

const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  createLikePost,
  deleteLikePost,
} = require("../../../controllers/post.controller");

const { authAuthorization } = require("../../../middlewares/auth.middleware");

router.get(`/`, authAuthorization, getPosts);

router.post(`/`, authAuthorization, createPost);

router.get(`/:postId`, authAuthorization, getPost);

router.put(`/:postId`, authAuthorization, updatePost);

router.delete(`/:postId`, authAuthorization, deletePost);

router.put(`/:postId/like`, authAuthorization, createLikePost);

router.put(`/:postId/unlike`, authAuthorization, deleteLikePost);

module.exports = router;
