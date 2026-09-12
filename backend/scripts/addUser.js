require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize } = require("../config/");
const { User } = require("../models/");

const name = "Fraser";
const email = "fraserelliott@hotmail.com";
const password = "fraserdev";

(async () => {
  await User.create({ name, email, password });
})();
