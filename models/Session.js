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
    photos: {
        required: true,
        type: [new mongoose.Schema({
            key: {
                required: true,
                unique: true,
                type: String
            },
            owner: {
                required: true,
                type: mongoose.ObjectId
            },
            type: {
                required: true,
                type: String,
                enum: ["image", "video"],
                default: "image"
            }
        }, {
            timestamps: true
        })],
        default: []
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