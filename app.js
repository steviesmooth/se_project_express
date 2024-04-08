require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const app = express();

const { errors } = require("celebrate");

const { PORT = 3001 } = process.env;

const errorHandler = require("./middlewares/error-handling");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const {
  validateUserLogin,
  validateUserBody,
} = require("./middlewares/validation");

const { login, createUser } = require("./controllers/users");

app.listen(PORT, () => {
  console.log("this is working");
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("connected to DB", r);
});
app.use(cors());

const routes = require("./routes/index");

app.use(express.json());
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", validateUserLogin, login);
app.post("/signup", validateUserBody, createUser);

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);
