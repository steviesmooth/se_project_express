require("dotenv").config();
const express = require("express");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handling");
const app = express();
const { errors } = require("celebrate");
const { PORT = 3001 } = process.env;

const mongoose = require("mongoose");

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
app.post("/signin", login);
app.post("/signup", createUser);

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);
