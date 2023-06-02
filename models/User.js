const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        index: {
            unique: true
        }
    },
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    fullName: {
        required: true,
        type: String
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
    },
    friends: {
        required: true,
        type: [mongoose.ObjectId],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);