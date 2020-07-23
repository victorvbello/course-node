const express = require('express');

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
  res.json({ user: { ...body } });
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
