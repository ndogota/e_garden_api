// import packages for scraping
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

// import models
const Plant = require("../database/models/plant.model");
const PlantFeature = require("../database/models/plant-feature.model");

// import mongoDB connection
const { connectMongooseDatabase } = require("../database/connection");

// import resources & data
const referencesFeaturesList = require("../resources/referencesFeaturesList.json");
const plantsInformations = require("../resources/infos-plantes.json");
const monthsList = require("../resources/monthsList.json");

// get url for scraping features list
const featuresUrl = process.env.APP_SCRAPING_FEATURES_INFORMATIONS_URL;

// run mongoDB connection
connectMongooseDatabase();

// store all existing features values in associative array
const arrayListValues = {
  Entretien: [],
  "Besoin en eau": [],
  Croissance: [],
  "Resistance au froid": [],
  "PH du sol": [],
  "Anti-insectes": [],
  Exposition: [],
};

// get all values about features & their existing values
function getValues(data) {
  referencesFeaturesList.forEach((element) => {
    const array = data(`#${element.cssClassLabel} label`).text().split("\n");

    const split = data(`#_voir_information_${element.cssClassParagraph} p`)
      .text()
      .split("\n")
      .toString();
    const modalInfo = split.substring(split.indexOf("?") + 1);

    arrayListValues[`${element.typeName}`].push(
      array.filter((e) => e),
      modalInfo
    );
  });
}

// get all plantation dates about one plant
function getPlantationDate(data) {
  const plantationDateList = [];
  const plantationDate = data(`td._selected1`).text();
  for (let i = 0; i < monthsList.length; i++) {
    if (plantationDate.includes(monthsList[i])) {
      plantationDateList.push(monthsList[i]);
    }
  }
  return plantationDateList;
}

// get all harvest dates about one plant
function getHarvestDate(data) {
  const harvestDateList = [];
  const harvestDate = data(`td._selected3`).text();
  for (let i = 0; i < monthsList.length; i++) {
    if (harvestDate.includes(monthsList[i])) {
      harvestDateList.push(monthsList[i]);
    }
  }
  return harvestDateList;
}

// get all urls from plants json file
function getUrls() {
  const urls = [];

  for (let plant of plantsInformations.plants) {
    urls.push(plant.urlScraping);
  }
  return urls;
}

// get main informations about plant
async function getMainInfo(data) {
  const plantName = data("#fiches_plantes h1").html();
  const plantDescription = data("#images_plante p").html();
  const plantImage = data(".img_selected a").find("img").attr("src");

  return [plantName, plantDescription, plantImage];
}

// get all existing values about features
function getAllAvailableValues(data) {
  getValues(data);

  const values = {};

  for (let key in arrayListValues) {
    const informations = arrayListValues[key];
    values[`${key}`] = `${informations[0]}`;
  }

  const array = [];
  array.push(Object.values(values).join().split(","));

  const flat = array.flat().flat();

  if (flat.includes("Mouches blanches")) {
    const index = array.flat().indexOf("Mouches blanches");
    array.splice(index, 1, "Mouches");
  }
  return array.flat().flat();
}

// get all detailed informations about plant
function getAllDetailedData(detailedData, availableValues) {
  const informations = detailedData(".bulle_info2").text();
  const results = [];

  for (let i = 0; i < availableValues.length; i++) {
    if (informations.includes(availableValues[i])) {
      results.push(availableValues[i]);
    }
  }
  return results;
}

// get pH about plant
function getPH(detailedData) {
  const allPHValues = ["acide", "neutre", "alcalin"];
  const informations = detailedData(".bulle_info2").text();
  const results = [];

  for (let i = 0; i < allPHValues.length; i++) {
    if (informations.includes(allPHValues[i])) {
      results.push(`Sol ${allPHValues[i]}`);
    }
  }
  return results;
}

// get data from scraped website
async function requestAPI(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

// get all existing features in database
async function getFeatures() {
  const features = {};
  const plantFeatures = await PlantFeature.find();
  plantFeatures.forEach((feature) => {
    features[feature.plantFeatureId] = feature.values;
  });
  return features;
}

// scrap data on website for filling in database
async function scrapeData() {
  // url for getting features values
  const linkFeatures = `${featuresUrl}`;

  // call function for requesting features values
  const responseFeaturesValues = await requestAPI(linkFeatures);

  const allFeatures = await getFeatures();

  for (const [index, url] of getUrls().entries()) {
    // call function for requesting plants values
    const responseDetailedInformations = await requestAPI(url);

    // get all existing plants values
    const allAvailableValues = getAllAvailableValues(responseFeaturesValues);

    // final values without pH
    const allDetailedData = getAllDetailedData(
      responseDetailedInformations,
      allAvailableValues
    ).flat();

    // final values with pH
    allDetailedData.push(getPH(responseDetailedInformations));
    const allData = allDetailedData.flat();

    // filter data & replace values for better comprehension
    allData.forEach(function callback(value, index) {
      switch (value) {
        case "Résistante":
          allData.splice(index, 1, "Résistante (rustique)");
          break;
        case "À protéger":
          allData.splice(index, 1, "À protéger (semi-rustique)");
          break;
        case "À rentrer":
          allData.splice(index, 1, "À rentrer (fragile)");
          break;
        case "Moustiques":
          allData.splice(index, 1, "Anti-moustiques");
          break;
        case "Pucerons":
          allData.splice(index, 1, "Anti-pucerons");
          break;
        case "Mouches":
        case "Limaces":
        case "Doryphores":
          allData.splice(
            index,
            1,
            "Anti-mouches, anti-limaces et anti-doryphores"
          );
          break;
        default:
      }
    });

    // object which contains the final data set
    const result = {};

    // double buckles for filtering data
    for (let i = 0; i < allData.length; i++) {
      for (let j = 0; j < Object.keys(allFeatures).length; j++) {
        if (Object.keys(Object.values(allFeatures)[j]).includes(allData[i])) {
          result[Number(Object.keys(allFeatures)[j])] = allData[i];
        }
      }
    }

    // call functions for scraping data
    const data = await requestAPI(url);
    const mainInfo = await getMainInfo(data);

    const plantName = mainInfo[0];
    const plantDescription = mainInfo[1];
    const plantImageUrl = mainInfo[2];
    const plantationDates = getPlantationDate(data);
    const harvestDates = getHarvestDate(data);

    // add scraped plants in database
    const plant = await new Plant({
      // plantId: index + 1,
      name: plantName,
      attributes: {
        description: plantDescription,
        imageUrl: plantImageUrl,
        features: result,
        plantationDate: plantationDates,
        harvestDate: harvestDates,
      },
    });
    await plant.save();
  }

  // call database for checking if data has been successfully added
  const plants = await Plant.find();
  console.log(plants);
}

scrapeData().then(process.exit);
