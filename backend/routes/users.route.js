const router = require('express').Router();
const { User } = require('../models/index.model');
const { FailSchema, StringField } = require('@fraserelliott/fail');
const inputValidation = require('../middleware/inputvalidation.middleware');
const auth = require('../middleware/auth.middleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define validation rules for user registration inputs
const userSchema = new FailSchema();
userSchema.add('email', new StringField().required().email().maxLength(255));
// regex checks for at least one special character from this set !@#$%^&*(),.?":{}|<>_-[]=/+;'/`~\
userSchema.add(
  'password',
  new StringField()
    .required()
    .minLength(8)
    .maxLength(20)
    .regex(/[!@#$%^&*(),.?":{}|<>_\-\\[\]=+;'/`~\/]/),
);
userSchema.add('name', new StringField().required().maxLength(255));

// Route to create a new user after validating the input
router.post('/', auth.validateToken, inputValidation.validate(userSchema), async (req, res) => {
  try {
    const saltRounds = 10;
    const { email, name, password } = req.body;
    const user = await User.create({ email: email.trim().toLowerCase(), name, password });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    }); // Don't return hashed password
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Error creating user.' });
  }
});

const loginSchema = new FailSchema();
loginSchema.add('email', new StringField().required().email());
loginSchema.add('password', new StringField().required());

router.post('/login', inputValidation.validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid username or password. ' });

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });
    res.status(200).json({
      token,
      email: user.email,
      name: user.name,
      id: user.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;
