const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    points: [
        {
            point: {
                type: Schema.Types.ObjectId,
                ref: 'point'
            }
        }
    ],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    photos: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('trip', TripSchema);
