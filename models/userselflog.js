const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  action: String,
  user: String,
  details: {
    userId: String,
    email: String,
    username: String, // Include username field in details
    phoneNumber: String, // Include phoneNumber field in details
    password: String,
    loginTime: Date // Include loginTime field in details
  }
});

module.exports = mongoose.model('userselflog', logSchema);
