const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/fileshare";
const connectToMongo = () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Error connecting to database:", error);
    });
};

module.exports = connectToMongo;
