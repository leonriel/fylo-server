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
    startDate: {
        required: true,
        type: Date,
        default: new Date()
    },
    endDate: {
        required: true,
        type: Date,
        default: new Date()
    },
    isActive: {
        required: true,
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model('Session', sessionSchema);