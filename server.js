const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");
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

app.use(
  session({
    secret: process.env.APP_SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 10, secure: true }, // 10min
    httpOnly: true,
    saveUninitialized: true,
    resave: false,
  })
);

const apiUrl = process.env.APP_URL_API;

const authRoutes = require("./routes/api/auth/auth.route");

app.use(`${apiUrl}/auth`, authRoutes);

// run server
app.listen(process.env.APP_PORT, () => {
  console.log(
    `Auth service is running on ${process.env.APP_AUTH_SERVICE_LOCAL_URL}.`
  );
});
