const express = require("express");
const router = express.Router();

const {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
} = require("../../../controllers/auth.controller");

const { authAuthorization } = require("../../../middlewares/auth.middleware");
const { adminAuthorization } = require("../../../middlewares/admin.middleware");

router.post(`/register`, registerUser);

router.post(`/login`, loginUser);

router.get(
  `/current-user`,
  authAuthorization,
  adminAuthorization,
  getCurrentUser
);

router.get(`/logout`, authAuthorization, logoutUser);

module.exports = router;
