const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../../../controllers/user.controller");

const { authAuthorization } = require("../../../middlewares/auth.middleware");
const { adminAuthorization } = require("../../../middlewares/admin.middleware");

router.get(`/`, authAuthorization, adminAuthorization, getUsers);

router.get(`/:id`, authAuthorization, adminAuthorization, getUser);

router.put(`/:id`, authAuthorization, adminAuthorization, updateUser);

router.delete(`/:id`, authAuthorization, adminAuthorization, deleteUser);

module.exports = router;
