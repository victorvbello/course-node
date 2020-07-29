const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/users');

const app = express();

app.get('/user', (req, res) => {
  const { query = {} } = req;
  const {
    limit_form: limitFrom = 0,
    limit_to: limitTo = 5,
    all: showAll = false,
  } = query;

  const queryCondition = showAll ? {} : { status: true };

  User.find(queryCondition, 'name email img role status google')
    .skip(parseInt(limitFrom, 10))
    .limit(parseInt(limitTo, 10))
    .exec((listError, result) => {
      if (listError) {
        return res
          .status(400)
          .json({ success: false, error: { ...listError } });
      }

      User.count(queryCondition, (countError, total) => {
        if (countError) {
          return res
            .status(400)
            .json({ success: false, error: { ...countError } });
        }
        res.json({ success: true, users: result, total });
      });
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
    password: password ? bcrypt.hashSync(password, 10) : null,
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
  const { params: { id: idToDelete = '' } = {} } = req;

  User.findByIdAndUpdate(
    idToDelete,
    { status: false },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(400).json({ success: false, error: { ...error } });
      }
      res.json({ success: true, user: result });
    },
  );
});

app.delete('/user/hard-delete/:id', (req, res) => {
  const { params: { id: idToDelete = '' } = {} } = req;

  User.findByIdAndRemove(idToDelete, (error, userDeleted) => {
    if (error) {
      return res.status(400).json({ success: false, error: { ...error } });
    }

    if (!userDeleted) {
      return res
        .status(404)
        .json({ success: false, error: { user: 'not found' } });
    }
    res.json({ success: true, user: userDeleted });
  });
});

module.exports = app;
