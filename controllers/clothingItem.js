const ClothingItem = require("../models/clothingItem");
const { BadRequestError, ServerError } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);
  const userId = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BadRequestError).send({ message: "Invalid data" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() =>
      res.status(200).send({ message: "Item was successfully deleted" }),
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid ID" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

// like item

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }

      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
