const express = require('express');

const app = express();

// user routes
app.use(require('./user'));
// auth routes
app.use(require('./auth'));

module.exports = app;
