const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/users');

const app = express();

app.get('/user', (req, res) => {
  res.json('get users ');
});

app.get('/user/:id', (req, res) => {
  const { id = 0 } = req.params;
  res.json('get user ' + id);
});

app.post('/user', (req, res) => {
  const { body = {} } = req;
  const { name = '', email = '', password = '', role = '' } = body;
  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
  });
  user.save((error, result) => {
    if (error) {
      return res.status(400).json({ success: false, error: { ...error } });
    }
    res.json({ success: true, user: result });
  });
});

app.put('/user/:id', (req, res) => {
  const { id = 0 } = req.params;
  res.json('put user ' + id);
});

app.delete('/user/:id', (req, res) => {
  const { id = 0 } = req.params;
  res.json('delete user ' + id);
});

module.exports = app;
