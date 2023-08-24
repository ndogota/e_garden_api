// return an error message if route does not exist
const getError = async (req, res) => {
  const path = req.originalUrl;
  req.session && req.session.userId
    ? console.log(
        `User ${req.session.userId} wants to access non-existing endpoint : ${path}`
      )
    : console.log(`A user wants to access non-existing endpoint : ${path}`);

  return res.status(404).json({ error: `404 Not Found !` });
};

module.exports = { getError };
