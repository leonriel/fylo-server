const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        index: {
            unique: true
        }
    },
    owner: {
        required: true,
        type: String
    },
    isActive: {
        required: true,
        type: Boolean,
        default: true
    },
    startDate: {
        required: true,
        type: Date,
        default: new Date()
    },
    endDate: {
        required: true,
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Album', albumSchema);