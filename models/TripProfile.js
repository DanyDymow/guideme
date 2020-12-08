const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    trips: [
        {
            type: Schema.Types.ObjectId,
            ref: 'trip'
        }
    ]
});

module.exports = Profile = mongoose.model('tripProfile', ProfileSchema);
