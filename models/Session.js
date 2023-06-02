const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    owner: {
        required: true,
        type: String
    },
    contributors: {
        required: true,
        type: [String], // Array of usernames
        default: [] // Should at least contain the owner's username
        
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