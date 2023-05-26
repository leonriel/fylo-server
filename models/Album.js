const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        index: {
            unique: true
        }
    },
    isActive: {
        required: false,
        type: Boolean,
        default: true
    },
    owner: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('Album', albumSchema);