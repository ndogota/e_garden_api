const express = require("express");
const router = express.Router();

const {
  getApiGateway,
} = require("../../../controllers/api-gateway.controller");

router.get(`/`, getApiGateway);

module.exports = router;
