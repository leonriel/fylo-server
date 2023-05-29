const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        required: true,
        type: String // Value is either "friend" or "invite"
    },
    senderFirstName: {
        required: true,
        type: String
    },
    senderLastName: {
        required: true,
        type: String
    },
    senderUsername: {
        required: true,
        type: String
    },
    details: {
        required: true,
        type: String,
        default: null // Value should be the session name if user is invited to session
    }
});

module.exports = mongoose.model('Notification', notificationSchema);