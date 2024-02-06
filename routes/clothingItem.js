const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.post("/", createItem);

router.get("/", () => getItems);

router.put("/:itemId", updateItem);

router.delete("/:itemId", deleteItem);

// like item
router.put("/:itemId/likes", likeItem);

// dislike item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
