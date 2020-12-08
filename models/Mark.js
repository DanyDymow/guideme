const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    point: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'point'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    photos: {
        type: String,
    },
});

module.exports = Profile = mongoose.model('markSchema', MarkSchema);
