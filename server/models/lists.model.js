const mongoose = require('mongoose');
const Card = require('./cards.model');

const listsSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cards' //each list 'has many' cards
    }],
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boards' //each list 'belongs to' a board
    }
});

module.exports = mongoose.model('Lists', listsSchema);