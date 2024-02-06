const express = require("express");

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");

const routes = require("./routes");

app.use(express.json());
app.use(routes);
app.use((req, res, next) => {
  req.user = {
    _id: "65c11aac4ee01d83701127ff", // paste the _id of the test user created in the previous step
  };
  next();
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("connected to DV", r);
});

app.listen(PORT, () => {
  console.log("this is working");
});
