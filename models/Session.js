const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    owner: {
        required: true,
        type: mongoose.ObjectId
    },
    contributors: {
        required: true,
        type: [mongoose.ObjectId], // Array of userIds
        default: [] // Should at least contain the owner's Id
        
    },
    isActive: {
        required: true,
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);