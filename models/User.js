const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        index: {
            unique: true
        }
    },
    hasActiveSession: {
        required: true,
        type: Boolean,
        default: false
    },
    sessions: {
        required: true,
        type: [mongoose.ObjectId],
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);