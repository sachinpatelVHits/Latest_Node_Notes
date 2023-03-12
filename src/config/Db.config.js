const mongoose = require("mongoose");
require("dotenv").config();
const responseMessage = require("../utils/ResponseMessage.json");

mongoose.set("strictQuery", false);
const config = mongoose  
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log(responseMessage.DATABASE_CONNECTED);
  })
  .catch((err) => {
    console.log(responseMessage.DATABASE_CONNECTION_ERROR, err);
  });