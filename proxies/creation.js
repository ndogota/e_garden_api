const { createProxyMiddleware } = require("http-proxy-middleware");
const {
  optionsAuth,
  optionsForum,
  optionsMailing,
  optionsNotification,
  optionsWiki,
  optionsProducts,
  optionsUsers,
} = require("./option");

const authProxy = createProxyMiddleware(optionsAuth);
const forumProxy = createProxyMiddleware(optionsForum);
const mailingProxy = createProxyMiddleware(optionsMailing);
const notificationProxy = createProxyMiddleware(optionsNotification);
const wikiProxy = createProxyMiddleware(optionsWiki);
const productsProxy = createProxyMiddleware(optionsProducts);
const usersProxy = createProxyMiddleware(optionsUsers);

module.exports = {
  authProxy,
  forumProxy,
  mailingProxy,
  notificationProxy,
  wikiProxy,
  productsProxy,
  usersProxy,
};
