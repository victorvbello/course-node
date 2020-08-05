const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getAccountInfo } = require('../helpers/google');
const User = require('../models/users');

const app = express();

const loginHandle = (req, res) => {
  const { body = {} } = req;
  const { email = '', password = '' } = body;

  User.findOne({ email }, (error, userDB) => {
    if (error) {
      return res.status(400).json({ success: false, error: { ...error } });
    }

    if (!userDB) {
      return res.status(401).json({
        success: false,
        error: { message: 'email / password invalid' },
      });
    }

    if (!bcrypt.compareSync(password, userDB.password)) {
      return res.status(401).json({
        success: false,
        error: { message: 'email / password invalid' },
      });
    }

    const token = jwt.sign({ user: userDB }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES,
    });
    res.json({ success: true, user: userDB, token });
  });
};

const googleAuthHandle = async (req, res) => {
  const { body: { googleToken = '' } = '' } = req;

  const { errors, data: accountInfo } = await getAccountInfo(googleToken);

  if (errors) {
    res.locales.logger.error('googleAuthHandle', errors);
    return res
      .status(401)
      .json({ success: false, error: { message: 'error google token' } });
  }

  if (!accountInfo) {
    res.locales.logger.error('googleAuthHandle', 'accountInfo is null');
    return res
      .status(401)
      .json({ success: false, error: { message: 'accountInfo is null' } });
  }

  const { name = '', email = '', img = '' } = accountInfo;

  User.findOne({ email: email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({ success: false, error: err });
    }
    if (userDB) {
      if (!userDB.google) {
        return res.status(400).json({
          success: false,
          error: { message: 'please use standard authentication' },
        });
      }
      const token = jwt.sign({ user: userDB }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES,
      });
      return res.json({ success: true, user: userDB, token });
    }

    const newUser = new User();

    newUser.name = name;
    newUser.email = email;
    newUser.img = img;
    newUser.password = 'empty';
    newUser.google = true;

    newUser.save((err, userResult) => {
      if (err) {
        return res.status(500).json({ success: false, error: err });
      }
      const token = jwt.sign({ user: userResult }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES,
      });
      return res.json({ success: true, user: userResult, token });
    });
  });
};

app.post('/login', loginHandle);
app.post('/google-auth', googleAuthHandle);

module.exports = app;
