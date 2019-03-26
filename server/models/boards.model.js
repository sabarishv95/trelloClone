const mongoose = require('mongoose');

const boardsSchema = new mongoose.Schema({
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lists' //each board 'has many' lists
    }]
});

module.exports = mongoose.model('Boards', boardsSchema);