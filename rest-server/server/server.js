require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

app.listen(process.env.PORT, () => {
  console.log(`Server run on port ${process.env.PORT}`);
});
