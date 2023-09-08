const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../../../controllers/auth.controller");

const { authAuthorization } = require("../../../middlewares/auth.middleware");

router.post(`/register`, registerUser);

router.post(`/login`, loginUser);

router.get(`/logout`, authAuthorization, logoutUser);

module.exports = router;
