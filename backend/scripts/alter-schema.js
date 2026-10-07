require("dotenv").config();
const { sequelize } = require("../config/");
require("../models");

sequelize.sync({ alter: true, logging: console.log }).then(() => {
  console.log("Schema updated to match models.");
  process.exit();
});
