const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    owner: {
        required: true,
        type: String
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

module.exports = mongoose.model('Album', albumSchema);