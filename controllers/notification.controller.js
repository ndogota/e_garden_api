const Notification = require("../database/models/notification.model");

// get all existing notifications
const getNotifications = async (req, res) => {
  const notification = await Notification.find({});

  if (notification.length === 0) {
    console.log(`No notifications existed !`);
    return res.status(404).json({ error: `No notifications existed !` });
  }

  console.log(`List of notifications : ${notification}`);
  return res.status(200).json({ response: notification });
};

// get one existing notification
const getNotification = async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findOne({ notificationId });

  if (!notification) {
    console.log(`Notification ${notificationId} does not exist !`);
    return res
      .status(404)
      .json({ error: `Notification ${notificationId} does not exist !` });
  }

  console.log(`Notification ${notificationId} :`, notification);
  return res.status(200).json({ notification });
};

// create one notification
const createNotification = async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const notification = new Notification({
    userId,
    message,
  });

  await notification
    .save()
    .then(async () => {
      console.log(
        `New notification ${notification.notificationId} has been successfully created !`
      );

      return res
        .status(201)
        .json({ response: `New notification has been successfully created !` });
    })
    .catch((err) => {
      if (err) {
        console.log(`Error notification creation :`, err);
        return res.status(500).json({ error: err });
      }
    });
};

// update one notification
const markedAsReadNotification = async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findOne({
    notificationId,
  });

  if (!notification) {
    console.log(`Notification ${notificationId} does not exist !`);
    return res
      .status(404)
      .json({ error: `Notification ${notificationId} does not exist !` });
  }

  if (notification.markedAsRead) {
    return res.status(500).json({
      error: `Error with marking as read notification ${notificationId} !`,
    });
  }

  notification.markedAsRead = true;

  await notification
    .save()
    .then(() => {
      console.log(
        `Notification ${notificationId} has been successfully updated !`
      );

      return res.status(200).json({
        response: `Notification ${notificationId} has been successfully updated !`,
      });
    })
    .catch((err) => {
      console.log(`Error occured with marking as read notification  !`, err);

      return res
        .status(400)
        .json({ error: `Error occured with marking as read notification !` });
    });
};

// delete one notification
const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  const isNotificationExist = await Notification.exists({ notificationId });

  if (!isNotificationExist) {
    console.log(`Notification ${notificationId} does not exist !`);
    return res
      .status(404)
      .json({ error: `Notification ${notificationId} does not exist !` });
  }

  const notification = await Notification.deleteOne({ notificationId });

  console.log(`Notification ${notificationId} has been successfully deleted !`);

  return res.status(202).json({
    response: `Notification ${notificationId} has been successfully deleted !`,
  });
};

module.exports = {
  getNotifications,
  getNotification,
  createNotification,
  markedAsReadNotification,
  deleteNotification,
};
