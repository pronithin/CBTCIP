const mongoose = require('mongoose');

const employeeLogSchema = new mongoose.Schema({
  action: String,
  performedBy: String,
  employeeAffected:String,
  timestamp: Date,
  details: {
    previousData: {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
      role: String,
      previousWorkPlace: String,
      experience: Number,
      education: String,
      skills: String,
      availability: Date
    },
    updatedData: {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
      role: String,
      previousWorkPlace: String,
      experience: Number,
      education: String,
      skills: String,
      availability: Date
    }
  }
});

const EmployeeLog = mongoose.model('empemplog', employeeLogSchema);

module.exports = EmployeeLog;
