const mongoose = require("mongoose");

const config = require("./config");

// connecting to database
mongoose.connect(config.mongodb_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.on("error", () => {
  console.log("mongodb connection error");
});
mongoose.connection.once("open", () => {
  console.log("mongodb connection success");
});

module.exports = mongoose;
