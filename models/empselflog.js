const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  action: String,
  employee: String,
  details: {
    employeeId: String,
    password: String,
    email: String,
    age: Number,
    phoneNumber: String,
    loginTime: Date, // Include loginTime field in details
    firstName: String, // Add firstName field
    lastName: String, // Add lastName field
    role: String, // Add role field
    previousWorkPlace: String, // Add previousWorkPlace field
    experience: Number, // Add experience field
    education: String, // Add education field
    skills: String, // Add skills field
    availability: Date, // Add availability field
  }
});

module.exports = mongoose.model('empselflog', logSchema);
