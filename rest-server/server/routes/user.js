const express = require('express');
const bcrypt = require('bcrypt');

const {
  validateToken,
  validateAdminRole,
} = require('../middlewares/authentication');

const User = require('../models/users');

const app = express();

const getUsersHandle = (req, res) => {
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

      User.countDocuments(queryCondition, (countError, total) => {
        if (countError) {
          return res
            .status(400)
            .json({ success: false, error: { ...countError } });
        }
        return res.json({ success: true, users: result, total });
      });
    });
};

const getUserHandle = (req, res) => {
  const { id = 0 } = req.params;

  User.findById(id, (error, userDB) => {
    if (error) {
      return res.status(400).json({ success: false, error });
    }
    if (!userDB) {
      return res
        .status(404)
        .json({ success: false, error: { message: 'not found' } });
    }
    return res.json({ success: true, user: userDB });
  });
};

const createUserHandle = (req, res) => {
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
    return res.json({ success: true, user: result });
  });
};

const updateUserHandle = (req, res) => {
  const { body = {}, params = {} } = req;
  const { id = '' } = params;
  const { name, email, role, img, password } = body;
  const finalData = {
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(password ? { password } : {}),
    ...(role ? { role } : {}),
    ...(img ? { img } : {}),
  };

  User.findByIdAndUpdate(
    id,
    finalData,
    { new: true, runValidators: true, context: 'query' },
    (error, result) => {
      if (error) {
        return res.status(400).json({ success: false, error: { ...error } });
      }
      if (!result) {
        return res
          .status(404)
          .json({ success: false, error: { message: 'not found' } });
      }
      return res.json({ success: true, user: result });
    },
  );
};

const softDeleteUserHandle = (req, res) => {
  const { params: { id: idToDelete = '' } = {} } = req;

  User.findByIdAndUpdate(
    idToDelete,
    { status: false },
    { new: true },
    (error, userDeleted) => {
      if (error) {
        return res.status(400).json({ success: false, error: { ...error } });
      }

      if (!userDeleted) {
        return res
          .status(404)
          .json({ success: false, error: { message: 'not found' } });
      }
      return res.json({ success: true, user: userDeleted });
    },
  );
};

const hardDeleteUserHandle = (req, res) => {
  const { params: { id: idToDelete = '' } = {} } = req;

  User.findByIdAndRemove(idToDelete, (error, userDeleted) => {
    if (error) {
      return res.status(400).json({ success: false, error: { ...error } });
    }

    if (!userDeleted) {
      return res
        .status(404)
        .json({ success: false, error: { message: 'not found' } });
    }
    return res.json({ success: true, user: userDeleted });
  });
};

app.get('/user', validateToken, getUsersHandle);
app.get('/user/:id', validateToken, getUserHandle);
app.post('/user', [validateToken, validateAdminRole], createUserHandle);
app.put('/user/:id', [validateToken, validateAdminRole], updateUserHandle);
app.delete(
  '/user/:id',
  [validateToken, validateAdminRole],
  softDeleteUserHandle,
);
app.delete(
  '/user/hard-delete/:id',
  [validateToken, validateAdminRole],
  hardDeleteUserHandle,
);

module.exports = app;
