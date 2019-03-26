const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    body: {
        type: String,
        required:true
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cards' //each comment 'belongs to' a card
    }
});

module.exports = mongoose.model('Comments', commentsSchema);