const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    score: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Score', scoreSchema);