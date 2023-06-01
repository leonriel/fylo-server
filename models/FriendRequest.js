const mongoose = require('mongoose');

const friendRequestSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "ignored", "canceled"],
        default: "pending"
    }
}, {
    collection: 'friendRequests'
});

module.exports = mongoose.model("FriendRequest", friendRequestSchema);