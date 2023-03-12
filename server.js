const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
require('./src/config/Db.config')
const route = require("./src/routes/Routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type","application/form-data");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use('/api', route);

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}🚀`);
});