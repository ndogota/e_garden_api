const Plant = require("../database/models/plant.model");

// get all existing plants
const getPlants = async (req, res) => {
  const plants = await Plant.find({});

  if (plants.length === 0) {
    console.log(`No plants existed !`);
    return res.status(404).json({ error: `No plants existed !` });
  }

  console.log(`List of plants : ${plants}`);
  return res.status(200).json({ response: plants });
};

// get one existing plant
const getPlant = async (req, res) => {
  const id = req.params.id;
  const plant = await Plant.findOne({ plantId: id });

  if (!plant) {
    console.log(`Plant ${id} does not exist !`);
    return res.status(404).json({ error: `Plant ${id} does not exist !` });
  }

  console.log(`Plant ${id} :`, plant);
  return res.status(200).json({ plant });
};

// delete one plant if it exists
const deletePlant = async (req, res) => {
  const id = req.params.id;
  const isPlantExist = await Plant.exists({ plantId: id });

  if (!isPlantExist) {
    console.log(`Plant ${id} does not exist !`);
    return res.status(404).json({ error: `Plant ${id} does not exist !` });
  }

  const plant = await Plant.deleteOne({ plantId: id });

  console.log(`Plant ${id} has been successfully deleted !`);
  return res
    .status(202)
    .json({ response: `Plant ${id} has been successfully deleted !` });
};

module.exports = {
  getPlants,
  getPlant,
  deletePlant,
};
