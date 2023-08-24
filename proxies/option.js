require("dotenv").config();

const optionsAuth = {
  target: process.env.APP_AUTH_SERVICE_LOCAL_URL,
  changeOrigin: true,
  logger: console,
};

const optionsForum = {
  target: process.env.APP_FORUM_SERVICE_LOCAL_URL,
  changeOrigin: true,
  logger: console,
};

const optionsMailing = {
  target: process.env.APP_MAILING_SERVICE_LOCAL_URL,
  changeOrigin: true,
  logger: console,
};

const optionsNotification = {
  target: process.env.APP_NOTIFICATION_SERVICE_LOCAL_URL,
  changeOrigin: true,
  logger: console,
};

const optionsWiki = {
  target: process.env.APP_WIKI_SERVICE_LOCAL_URL,
  changeOrigin: true,
  logger: console,
};

const optionsProducts = {
  target: process.env.APP_PRODUCT_SERVICE_LOCAL_URL,
  changeOrigin: true,
  logger: console,
};

const optionsUsers = {
  target: process.env.APP_USER_SERVICE_LOCAL_URL,
  changeOrigin: true,
  logger: console,
};

module.exports = {
  optionsAuth,
  optionsForum,
  optionsMailing,
  optionsNotification,
  optionsWiki,
  optionsProducts,
  optionsUsers,
};
