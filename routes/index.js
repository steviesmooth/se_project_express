const router = require("express").Router();
const clothingItem = require("../controllers/clothingItem");
const users = require("../controllers/users");

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
