const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PointSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    coordX: {
        type: Number
    },
    coordY: {
        type: Number
    }
});

module.exports = Profile = mongoose.model('pointSchema', PointSchema);
