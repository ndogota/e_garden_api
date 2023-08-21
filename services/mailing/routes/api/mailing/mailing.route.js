const express = require("express");
const router = express.Router();

const apiUrl = process.env.APP_URL_API;

const { sendMail } = require("../../../controllers/mailing.controller");

router.post(`/mail`, sendMail);

module.exports = router;
