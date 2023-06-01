const mongoose = require('mongoose');

const sessionInviteSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    sessionId: {
        type: mongoose.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "ignored", "canceled"],
        default: "pending"
    }
}, {
    collection: 'sessionInvites'
});

module.exports = mongoose.model("SessionInvite", sessionInviteSchema);