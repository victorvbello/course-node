const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/users');

const app = express();

app.get('/user', (req, res) => {
  const { query = {} } = req;
  const { limit_form: limitFrom = 0, limit_to: limitTo = 5 } = query;

  User.find({})
    .skip(parseInt(limitFrom))
    .limit(parseInt(limitTo))
    .exec((error, result) => {
      if (error) {
        return res.status(400).json({ success: false, error: { ...error } });
      }
      res.json({ success: true, users: result });
    });
});

app.get('/user/:id', (req, res) => {
  const { id = 0 } = req.params;
  res.json('get user ' + id);
});

app.post('/user', (req, res) => {
  const { body = {} } = req;
  const { name, email, password, role } = body;
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
  const { body = {}, params = {} } = req;
  const { id = '' } = params;
  const { name, email, role, img, status } = body;
  const finalData = { name, email, role, img, status };
  User.findByIdAndUpdate(id, finalData, { new: true }, (error, result) => {
    if (error) {
      return res.status(400).json({ success: false, error: { ...error } });
    }
    res.json({ success: true, user: result });
  });
});

app.delete('/user/:id', (req, res) => {
  const { id = 0 } = req.params;
  res.json('delete user ' + id);
});

module.exports = app;
