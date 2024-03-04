const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  ServerError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// create user

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!password || !email) {
    return res
      .status(BadRequestError)
      .send({ message: "email or password not present" });
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = res
          .status(ConflictError)
          .send({ message: "Email already exists" });
        return next(error);
      }

      return bcrypt.hash(password, 10).then((hash) => {
        User.create({ name, avatar, email, password: hash })
          .then((data) =>
            res.status(201).send({
              name: data.name,
              avatar: data.avatar,
              email: data.email,
            }),
          )
          .catch((err) => {
            console.error(err);
            if (err.name === "ValidationError") {
              return res
                .status(BadRequestError)
                .send({ message: "Invalid data" });
            }
            return next(err);
          });
      });
    })
    .catch(next);
};

// GET CURRENT USER

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error("User Id not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

// UPDATE USER

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { name, avatar } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: "Not Found Error" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

// Login
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ user, token });
    })
    .catch((err) => {
      if (err.name === "InvalidSignature") {
        return res.status(UnauthorizedError).send({ message: "unathorized" });
      }
      return res.status(BadRequestError).send({ message: "Invalid data" });
    });
};
module.exports = { createUser, login, getCurrentUser, updateUser };
