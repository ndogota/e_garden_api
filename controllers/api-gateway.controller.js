// get api-gateway
const getApiGateway = async (req, res) => {
  return res.status(200).json({ response: "Hello api gateway !" });
};

module.exports = { getApiGateway };
