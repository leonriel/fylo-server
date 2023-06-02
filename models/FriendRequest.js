const mongoose = require('mongoose');

const friendRequestSchema = mongoose.Schema({
    sender: {
        type: mongoose.ObjectId,
        required: true
    },
    recipient: {
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
    collection: 'friendRequests',
    timestamps: true
});

module.exports = mongoose.model("FriendRequest", friendRequestSchema);