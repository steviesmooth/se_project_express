const User = require("../models/user");
const {
  BadRequestError,
  ServerError,
  NotFoundError,
} = require("../utils/errors");

// get users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(ServerError).send({ message: err.message });
    });
};

// create user

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BadRequestError).send({ message: err.message });
      } else {
        res.status(ServerError).send({ message: err.message });
      }
    });
};

// Get User by ID

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const err = new Error("User ID not found");
      err.name = "NotFoundError";
      throw err;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      } else if (err.name === "NotFoundError") {
        return res.status(404).send({ message: err.message });
      } else {
        return res.status(500).send({ message: err.message });
      }
    });
};

module.exports = { getUsers, createUser, getUser };
