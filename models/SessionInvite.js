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

sessionInviteSchema.index({session: 1, status: -1});
sessionInviteSchema.index({recipient: 1, status: -1});
sessionInviteSchema.index({updatedAt: -1});
sessionInviteSchema.index({createdAt: -1});
sessionInviteSchema.index({session: 1, recipient: 1}, {unique: true});

module.exports = mongoose.model("SessionInvite", sessionInviteSchema);