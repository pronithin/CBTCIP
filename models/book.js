const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    phonenumber: String,
    address: String,
    noofattendees: Number,
    eventdate: Date,
    specialRequests: String,
    noofdays: Number,
    eventName: String
});

module.exports = mongoose.model('book', bookingSchema);
