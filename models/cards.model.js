const mongoose = require('mongoose');
const Comment = require('./comments.model');

const cardsSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    description: {
        type: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments' //each card 'has many' comments
    }],
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lists' //each card 'belongs to' a list
    }
});

module.exports = mongoose.model('Cards', cardsSchema);