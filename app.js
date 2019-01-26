var express = require('express');
var app = express();
require('./db');

// userContoller
var UserController = require('./user/UserController');
app.use('/users', UserController);

// authController
var authController = require('./auth/authController');
app.use('/api/auth', authController);

module.exports = app;