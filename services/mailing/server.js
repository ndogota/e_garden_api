const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
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

const apiUrl = process.env.APP_URL_API;

const mailingRoutes = require("./routes/api/mailing/mailing.route");

app.use(`${apiUrl}/mailing`, mailingRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(
    `Mailing service is running on ${process.env.APP_MAILING_SERVICE_LOCAL_URL}.`
  );
});
