const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../database/models/user.model");
require("dotenv").config();

// create one user if it does not exist
const registerUser = async (req, res) => {
  let isAdmin = false;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const isUserExist = await User.exists({ email });

  if (isUserExist) {
    return res.status(400).json({ error: `This account already exists !` });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "The password must contain at least 6 characters !" });
  }

  const securePassword = req.body.adminSecretPassword
    ? req.body.adminSecretPassword
    : null;

  if (securePassword) {
    const isSecurePasswordMatch = await bcrypt.compare(
      securePassword,
      process.env.APP_SECURE_ADMIN_PASSWORD_HASHED
    );

    if (!isSecurePasswordMatch) {
      return res
        .status(403)
        .json({ error: `Credentials are missing or wrong !` });
    }

    isAdmin = true;
  }

  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
    isAdmin: isAdmin ? true : false,
  });

  await user
    .save()
    .then(async () => {
      await axios.post(
        `${
          process.env.APP_API_GATEWAY_LOCAL_URL + process.env.APP_URL_API
        }/mailing/mail`,
        {
          email,
        },
        { withCredentials: true }
      );

      return res
        .status(201)
        .json({ response: `Your account has been successfully created !` });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    });
};

// login one user if it exists & credentials are good
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: `Credentials are wrong !` });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(403).json({ error: `Credentials are wrong !` });
  }

  let token = jwt.sign(
    {
      userId: user.userId,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },
    process.env.APP_SECRET_TOKEN,
    {
      expiresIn: "1h",
    }
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    expiresIn: "1h",
  });

  if (user.isAdmin) {
    const secretKeyHashed = await bcrypt.hash(
      process.env.APP_SECURE_ADMIN_KEY,
      10
    );

    res.cookie("authorization", secretKeyHashed, {
      httpOnly: true,
      secure: false,
      expiresIn: "1h",
    });
  }

  return res.status(200).json({
    response: `You have successfully logged in !`,
    user: user.userId,
  });
};

// logout one user if he is logged in
const logoutUser = async (req, res) => {
  res.clearCookie("access_token");

  if (req.cookies.authorization) {
    res.clearCookie("authorization");
  }

  return res
    .status(200)
    .json({ response: "You have successfully logged out !" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
