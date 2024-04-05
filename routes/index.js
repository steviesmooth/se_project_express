const router = require("express").Router();
const clothingItem = require("./clothingItem");
const users = require("./users");
const NotFoundError = require("../errors/not-found");

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res, next) => {
  next(new NotFoundError(`Route doesn't exist`));
});

module.exports = router;
