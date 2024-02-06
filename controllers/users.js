const User = require("../models/user");
const {
  Bad_Request_Error,
  Not_Found_Error,
  Server_Error,
} = require("../utils/errors");

// get users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(Server_Error).send({ message: err.message });
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
        res.status(Bad_Request_Error).send({ message: err.message });
      } else {
        res.status(Server_Error).send({ message: err.message });
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error("User Id not found");
      err.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers, createUser, getUser };
