const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productId: { type: String, default: shortid.generate, unique: true },
  name: { type: String, required: true },
  price: String,
  stock: { type: Number, minlength: 0 },
  dimension: String,
  color: String,
  description: String,
  rate: { type: Number, minlength: 0, maxlength: 5 },
  image: String,
  state: String,
  createdDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() },
});

const productClass = mongoose.model("products", productSchema);

module.exports = productClass;
