const express = require("express");
const router = express.Router();

const apiUrl = process.env.APP_URL_API;

const { getError } = require("../../../controllers/error.controller");

router.all(`*`, getError);

module.exports = router;
