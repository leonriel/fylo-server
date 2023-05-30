const mongoose = require('mongoose');
const Notification = require('./Notification');

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
    notifications: {
        required: true,
        type: [Notification.schema],
        default: []
    },
    friends: {
        required: true,
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);