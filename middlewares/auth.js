const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith("Bearer ")) {
    return res.status(UnauthorizedError).send({ message: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err);
    return res.status(UnauthorizedError).send({ message: "Unauthorized" });
  }
  req.user_id = payload;
  next();
};
