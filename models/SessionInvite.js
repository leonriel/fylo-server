const mongoose = require('mongoose');

const sessionInviteSchema = mongoose.Schema({
    sender: {
        type: mongoose.ObjectId,
        required: true
    },
    recipient: {
        type: mongoose.ObjectId,
        required: true
    },
    session: {
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
    collection: 'sessionInvites',
    timestamps: true
});

module.exports = mongoose.model("SessionInvite", sessionInviteSchema);