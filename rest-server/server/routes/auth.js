const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

const app = express();

app.post('/login', (req, res) => {
  const { body = {} } = req;
  const { email = '', password = '' } = body;

  User.findOne({ email }, (error, userDB) => {
    if (error) {
      return res.status(400).json({ success: false, error: { ...error } });
    }

    if (!userDB) {
      return res
        .status(401)
        .json({ success: false, error: { user: '-email / password invalid' } });
    }

    if (!bcrypt.compareSync(password, userDB.password)) {
      return res
        .status(401)
        .json({ success: false, error: { user: 'email / -password invalid' } });
    }

    const token = jwt.sign({ user: userDB }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES,
    });
    res.json({ success: true, user: userDB, token });
  });
});

module.exports = app;
