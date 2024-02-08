const User = require("../models/user");
const { BadRequestError, ServerError } = require("../utils/errors");

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

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      let err = new Error("User ID not found");
      err.name = "NotFoundError";
      console.log(err.name);
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers, createUser, getUser };
