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

friendRequestSchema.index({sender: 1, status: -1});
friendRequestSchema.index({recipient: 1, status: -1});
friendRequestSchema.index({updatedAt: -1});
friendRequestSchema.index({createdAt: -1});
friendRequestSchema.index({sender: 1, recipient: 1}, {unique: true});

module.exports = mongoose.model("FriendRequest", friendRequestSchema);