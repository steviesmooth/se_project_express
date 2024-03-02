const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err);
    return res.status(UnauthorizedError).send({ message: "Unauthorized" });
  }
  req.user = payload;
  next();
};
