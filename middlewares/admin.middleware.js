const bcrypt = require("bcrypt");

// middleware to verify if user is administrator
const adminAuthorization = async (req, res, next) => {
  const authorizationToken = req.cookies.authorization;

  if (!authorizationToken) {
    console.log(
      `User ${
        req.userId ? req.userId : ``
      } wants to make an administrator action whereas he does not have the authorization !`
    );
    return res.status(403).json({ error: `Permission denied !` });
  }

  const isMatch = await bcrypt.compare(
    authorizationToken,
    process.env.APP_SECURE_ADMIN_KEY
  );

  if (!isMatch) {
    return res.status(403).json({ error: `Permission denied !` });
  }

  return next();
};

module.exports = { adminAuthorization };
