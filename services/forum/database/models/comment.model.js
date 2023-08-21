const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commentId: { type: String, default: shortid.generate, unique: true },
  postId: { type: String, ref: "posts" },
  userId: { type: String, ref: "users" },
  content: { type: String, required: true },
  likes: [{ type: String, ref: "users" }],
  createdDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() },
});

const commentClass = mongoose.model("comments", commentSchema);

module.exports = commentClass;
