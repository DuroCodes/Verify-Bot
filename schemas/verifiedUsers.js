const { Schema, model } = require('mongoose');

const verifiedUsers = new Schema({
  userID: String,
  verified: Boolean,
});

module.exports = model('verified-users', verifiedUsers);
