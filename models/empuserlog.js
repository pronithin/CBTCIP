// log.js

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: String,
  performedBy: String,
  userAffected: String,
  timestamp: Date,
  details: {
    previousData: {
      userId: String,
      email: String,
      username: String,
      phoneNumber: String,
      loginTime: Date
    },
    updatedData: {
      email: String,
      username: String,
      phoneNumber: String,
    }
  }
});

const Log = mongoose.model('empuserlog', logSchema);

module.exports = Log;
