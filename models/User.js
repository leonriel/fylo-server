const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        index: {
            unique: true
        }
    }
});

module.exports = mongoose.model('User', userSchema);