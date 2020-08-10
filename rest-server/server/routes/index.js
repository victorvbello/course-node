const express = require('express');

const app = express();

// auth routes
app.use(require('./auth'));
// user routes
app.use(require('./user'));
// category routes
app.use(require('./category'));
// product routes
app.use(require('./product'));
// uploads routes
app.use(require('./file'));

module.exports = app;
