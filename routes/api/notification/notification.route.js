const express = require("express");
const router = express.Router();

const {
  getNotifications,
  getNotification,
  createNotification,
  markedAsReadNotification,
  deleteNotification,
} = require("../../../controllers/notification.controller");

const { authAuthorization } = require("../../../middlewares/auth.middleware");

router.get(`/`, authAuthorization, getNotifications);

router.get(`/:notificationId`, authAuthorization, getNotification);

router.post(`/`, authAuthorization, createNotification);

router.put(`/:notificationId`, authAuthorization, markedAsReadNotification);

router.delete(`/:notificationId`, authAuthorization, deleteNotification);

module.exports = router;
