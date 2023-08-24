const jwt = require("jsonwebtoken");

// middleware to verify if user is logged in with token
const authAuthorization = async (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: `Permission denied. Please login !` });
  }

  try {
    const data = jwt.verify(accessToken, process.env.APP_SECRET_TOKEN);
    req.userId = data.userId;
    return next();
  } catch {
    return res.status(401).json({ error: `Permission denied. Please login !` });
  }
};

module.exports = { authAuthorization };
