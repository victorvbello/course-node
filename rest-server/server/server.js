require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// user routes
app.use(require('./routes/user'));

mongoose
  .connect(process.env.URl_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Mongo is ONLINE');
  })
  .catch((error) => console.log('Mongo error', error));

app.listen(process.env.PORT, () => {
  console.log(`Server run on port ${process.env.PORT}`);
});
