const router = require("express").Router();
const clothingItem = require("./clothingItem");
const users = require("./users");
const auth = require("../middlewares/auth");
const { NotFoundError } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", auth, users);

router.use((req, res) => {
  res.status(NotFoundError).send({ message: "Router not found" });
});

module.exports = router;
