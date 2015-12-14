'use strict';

/**
 * This module connects to mongodb and exports a mongoose model "User"
 */

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/eta');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
