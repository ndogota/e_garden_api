const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  notificationId: { type: String, default: shortid.generate, unique: true },
  userId: { type: String, required: true },
  message: { type: String, required: true },
  markedAsRead: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() },
});

const notificationClass = mongoose.model("notifications", notificationSchema);

module.exports = notificationClass;
