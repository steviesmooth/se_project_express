const User = require("../models/user");
const { BadRequestError, ServerError } = require("../utils/errors");

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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BadRequestError).send({ message: "Invalid data" });
      } else {
        res
          .status(ServerError)
          .send({ message: "An error has occurred on the server." });
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
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUser };
