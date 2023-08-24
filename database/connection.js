const mongoose = require("mongoose");
require("dotenv").config();

function connectMongooseDatabase() {
  mongoose
    .connect(process.env.APP_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`The server has successfully connected to the database.`);
    })
    .catch((err) => {
      console.log(`Connection error :`, err);
    });
}

module.exports = { connectMongooseDatabase };
