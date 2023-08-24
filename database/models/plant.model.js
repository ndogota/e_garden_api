const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const plantSchema = new Schema({
  plantId: { type: String, default: shortid.generate, unique: true },
  name: { type: String, required: true },
  attributes: {
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    features: {},
    plantationDate: { type: [String], required: true },
    harvestDate: { type: [String], required: true },
  },
  createdDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() },
});

const plantClass = mongoose.model("plants", plantSchema);

module.exports = plantClass;
