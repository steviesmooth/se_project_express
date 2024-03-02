const express = require("express");

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
app.use((req, res, next) => {
  req.user = {
    _id: "65c11aac4ee01d83701127ff", // paste the _id of the test user created in the previous step
  };
  next();
});

const routes = require("./routes/index");

app.post("/signin", login);
app.post("/signup", createUser);

app.use(express.json());
app.use(routes);
