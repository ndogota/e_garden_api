const express = require("express");
require("dotenv").config();
const {
  authProxy,
  forumProxy,
  mailingProxy,
  notificationProxy,
  wikiProxy,
  productsProxy,
  usersProxy,
} = require("./proxies/creation");

const app = express();

const apiUrl = process.env.APP_URL_API;

const apiGatewayRoutes = require("./routes/api/api-gateway/api-gateway.route");
const errorRoutes = require("./routes/api/error/error.route");

app.use(`${apiUrl}/api-gateway`, apiGatewayRoutes);
app.use(`${apiUrl}/auth`, authProxy);
app.use(`${apiUrl}/forum/posts`, forumProxy);
app.use(`${apiUrl}/mailing`, mailingProxy);
app.use(`${apiUrl}/notifications`, notificationProxy);
app.use(`${apiUrl}/users`, usersProxy);
app.use(`${apiUrl}/products`, productsProxy);
app.use(`${apiUrl}/wiki/plants`, wikiProxy);
app.use(`/`, errorRoutes);

// run server
app.listen(process.env.APP_PORT, () => {
  console.log(
    `Api-gateway is running on ${process.env.APP_API_GATEWAY_LOCAL_URL}.`
  );
});
