const express = require("express");

const cors = require("cors");

const app = express();
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

app.use(routes);
