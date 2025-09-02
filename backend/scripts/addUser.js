require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/connection');
const { User } = require('../models/index.model');

const name = 'Test';
const email = 'testuser@test.com';
const password = 'testmctestface';

await User.create({ name, email, password });
