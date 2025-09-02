require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/');
const { User } = require('../models/index.model');

const name = 'Test';
const email = 'testuser@test.com';
const password = 'testmctestface';

(async () => {
  await User.create({ name, email, password });
})();
