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
    phoneNumber: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        index: {
            unique: true
        }
    },
    cognitoUserSub: {
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