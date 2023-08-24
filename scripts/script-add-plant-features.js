// import packages for scraping
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

// import resources & data
const PlantFeature = require("../database/models/plant-feature.model");
const referencesFeaturesList = require("../resources/referencesFeaturesList.json");
const { connectMongooseDatabase } = require("../database/connection");

// get url for scraping features list
const featuresInformationsUrl =
  process.env.APP_SCRAPING_FEATURES_INFORMATIONS_URL;

// run mongoDB connection
connectMongooseDatabase();

// get data from scraped website
async function requestAPI(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

// get all informations about tips features
function getFeaturesInformations(data) {
  const featuresInformationsList = [];

  referencesFeaturesList.forEach((element) => {
    switch (element.cssClassParagraph) {
      case "expo":
        featuresInformationsList.push(
          data(`#_voir_information_expo`)
            .text()
            .trim()
            .split("\n")
            .slice(4, 11)
            .filter((str) => str !== "")
        );
        break;
      case "ph":
      case "insecte":
        featuresInformationsList.push(
          data(`#_voir_information_${element.cssClassParagraph}`)
            .text()
            .trim()
            .split("\n")
            .slice(2, 5)
        );
        break;
      case "besoin":
        featuresInformationsList.push(
          data(`#_voir_information_${element.cssClassParagraph}`)
            .text()
            .trim()
            .split("\n")
            .slice(3, 6)
        );
        break;
      case "entretien":
      case "croissance":
      case "resist":
        featuresInformationsList.push(
          data(`#_voir_information_${element.cssClassParagraph}`)
            .text()
            .trim()
            .split("\n")
            .slice(1, 4)
        );
        break;
      default:
        featuresInformationsList.push(
          data(`#_voir_information_${element.cssClassParagraph}`)
            .text()
            .trim()
            .split("\n")
            .slice(1, 6)
        );
    }
  });
  return featuresInformationsList;
}

// scrap relevant data & save data in database
async function addPlantFeaturesInDatabase() {
  const featureLink = `${featuresInformationsUrl}`;
  const responseFeaturesValues = await requestAPI(featureLink);

  const features = getFeaturesInformations(responseFeaturesValues);

  for (let i = 0; i < referencesFeaturesList.length; i++) {
    const result = {};

    for (let j = 0; j < 3; j++) {
      const key = features[i][j].split(":")[0].trim();
      result[key] = features[i][j].split(":")[1].trim();
    }
    const plantFeature = new PlantFeature({
      plantFeatureId: i + 1,
      plantFeatureName: referencesFeaturesList[i].typeName,
      values: result,
    });
    await plantFeature.save();
  }

  const plantFeatures = await PlantFeature.find();
  console.log(plantFeatures);
}

addPlantFeaturesInDatabase().then(process.exit);
