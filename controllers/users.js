const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  ServerError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// get users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

// create user

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  let errors = [];
  User.findOne({ email }).then((user) => {
    if (user) {
      errors.push({ message: "Email is already in use" });
      res.render("register", { errors });
    }
    return bcrypt.hash(password, 10).then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          console.error(err);
          if (err.name === "ValidationError") {
            return res
              .status(BadRequestError)
              .send({ message: "Invalid data" });
          }
          return res
            .status(ServerError)
            .send({ message: "An error has occurred on the server." });
        });
    });
  });
};

// Get User by ID

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
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

//Login
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      res
        .status(UnauthorizedError)
        .send({ message: "Incorrect email or password" });
    });
};
module.exports = { getUsers, createUser, getUser, login };
