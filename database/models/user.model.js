const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: String, default: shortid.generate, unique: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, minlength: 6, required: true },
  firstname: String,
  lastname: String,
  location: {
    address: String,
    zipCode: String,
    city: String,
    country: String,
  },
  gender: String,
  phoneNumber: String,
  birthDate: Date,
  isAdmin: { type: Boolean, default: false },
  creationDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() },
});

const userClass = mongoose.model("users", userSchema);

module.exports = userClass;
