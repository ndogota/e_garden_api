const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { connectMongooseDatabase } = require("./database/connection");
require("dotenv").config();

connectMongooseDatabase();

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  rateLimit({
    max: 50,
    windowMs: 60 * 1000,
    message: `You made too many requests. Please try again later !`,
  })
);

app.use(cookieParser());

const apiUrl = process.env.APP_URL_API;

const plantRoutes = require("./routes/api/wiki/plant.route");

app.use(`${apiUrl}/wiki/plants`, plantRoutes);

// run server
app.listen(process.env.APP_PORT, () => {
  console.log(
    `Wiki service is running on ${process.env.APP_WIKI_SERVICE_LOCAL_URL}.`
  );
});
