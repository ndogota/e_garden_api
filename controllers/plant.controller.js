const Plant = require("../database/models/plant.model");
const User = require("../database/models/user.model");

// get all existing plants
const getPlants = async (req, res) => {
  const plants = await Plant.find({});

  if (plants.length === 0) {
    return res.status(404).json({ error: `No plants existed !` });
  }

  return res.status(200).json({ response: plants });
};

// get one existing plant
const getPlant = async (req, res) => {
  const { plantId } = req.params;
  const plant = await Plant.findOne({ plantId });

  if (!plant) {
    return res.status(404).json({ error: `Plant ${plantId} does not exist !` });
  }

  return res.status(200).json({ plant });
};

// delete one plant if it exists
const deletePlant = async (req, res) => {
  const { plantId } = req.params;
  const { userId } = req;

  const isUserExist = await User.exists({ userId });

  if (!isUserExist) {
    return res.status(500).json({ error: `User ${userId} does not exist !` });
  }

  const isPlantExist = await Plant.exists({ plantId });

  if (!isPlantExist) {
    return res.status(404).json({ error: `Plant ${plantId} does not exist !` });
  }

  const plant = await Plant.deleteOne({ plantId });

  return res
    .status(202)
    .json({ response: `Plant ${plantId} has been successfully deleted !` });
};

module.exports = {
  getPlants,
  getPlant,
  deletePlant,
};
