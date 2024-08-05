const mongoose = require('mongoose');

const UserWall = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('wall', UserWall);