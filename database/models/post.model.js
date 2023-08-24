const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    postId: { type: String, default: shortid.generate, unique: true },
    userId: { type: String, ref: "users" },
    comments: {},
    topic: String,
    title: String,
    content: String,
    likes: [{ type: String, ref: "users" }],
    createdDate: { type: Date, default: Date.now() },
    updatedDate: { type: Date, default: Date.now() },
  },
  { minimize: false }
);

const postClass = mongoose.model("posts", postSchema);

module.exports = postClass;
