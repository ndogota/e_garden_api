const express = require("express");
const router = express.Router();

const {
  getPlants,
  getPlant,
  deletePlant,
} = require("../../../controllers/plant.controller");

const { authAuthorization } = require("../../../middlewares/auth.middleware");
const { adminAuthorization } = require("../../../middlewares/admin.middleware");

router.get(`/`, getPlants);

router.get(`/:plantId`, getPlant);

router.delete(`/:plantId`, authAuthorization, adminAuthorization, deletePlant);

module.exports = router;
