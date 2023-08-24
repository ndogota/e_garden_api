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

const userRoutes = require("./routes/api/user/user.route");

app.use(`${apiUrl}/users`, userRoutes);

// run server
app.listen(process.env.APP_PORT, () => {
  console.log(
    `User service is running on ${process.env.APP_USER_SERVICE_LOCAL_URL}.`
  );
});
