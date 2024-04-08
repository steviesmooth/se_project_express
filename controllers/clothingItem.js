const ClothingItem = require("../models/clothingItem");
const ForbiddenError = require("../errors/forbidden");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");

const createItem = (req, res, next) => {
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
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Item ID not found"))
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError("Forbidden");
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })
    .catch((err) => {
      next(err);
    });
};

// like item

const likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail(() => new NotFoundError("Item ID not found"))
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      next(err);
    });

const dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail(() => new NotFoundError("Item ID not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      next(err);
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
