const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
        unique: true

    },

    phoneNumber:{
        type: String,
        default:'Not given',
        required: true
    },

    role: {
        type: String,
        required: true
    },

    previousWorkPlace:{
        type: String,

    },

    experience:{
        type: Number,

    },

    education:{
        type: String
    },

    skills:{
        type:String
    },

    availability:{
        type: Date,
        required: true
    },

     password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Employee', employeeSchema);