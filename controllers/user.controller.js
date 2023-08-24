const User = require("../database/models/user.model");

// get all existing users
const getUsers = async (req, res) => {
  const users = await User.find({});

  if (users.length === 0) {
    console.log(`No users existed !`);
    return res.status(404).json({ error: `No users existed !` });
  }

  console.log(`List of users : ${users}`);
  return res.status(200).json({ response: users });
};

// get one existing user
const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ userId: id });

  if (!user) {
    console.log(`User ${id} does not exist !`);
    return res.status(404).json({ error: `User ${id} does not exist !` });
  }

  console.log(`User ${id} :`, user);
  return res.status(200).json({ user });
};

// update one user if it exists
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { isAdmin } = req.body;

  const isUserExist = await User.findOneAndUpdate({ userId: id }, { isAdmin });

  if (!isUserExist) {
    console.log(`User ${id} does not exist !`);
    return res.status(404).json({ error: `User ${id} does not exist !` });
  }

  console.log(
    `User ${id} has been successfully updated ${
      req.session.userId ? `by user : ` + req.session.userId : ``
    } !`
  );

  return res
    .status(200)
    .json({ response: `User ${id} has been successfully updated !` });
};

// delete one user if it exists
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const isUserExist = await User.exists({ userId: id });
  const userId = req.session.userId;

  if (!isUserExist) {
    console.log(
      `${
        userId
          ? `User : ` +
            userId +
            ` wants to delete user ${id} but does not exist !`
          : `User ${id} does not exist !`
      }`
    );
    return res.status(404).json({ error: `User ${id} does not exist !` });
  }

  const user = await User.deleteOne({ userId: id });

  console.log(
    `User ${id} has been successfully deleted ${
      userId ? `by user : ` + userId : ``
    } !`
  );
  return res
    .status(202)
    .json({ response: `User ${id} has been successfully deleted !` });
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
