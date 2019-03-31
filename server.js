const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const config = require('./config');
const cors = require('cors');
//require APIs

const BoardApi = require('./api/boards.api');
const ListApi = require('./api/lists.api');
const cardApi = require('./api/cards.api');
const commentApi = require('./api/comments.api');


// connect database

mongoose.connect(config.db_host, { useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.on('connected', () => {
    console.log('connected to mongodb');
});

mongoose.connection.on('error', (err) => {
    if (err) {
        console.log('error in connection is :' + err);
    }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use('/board', BoardApi);
app.use('/list', ListApi);
app.use('/card', cardApi);
app.use('/comment', commentApi);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(config.server_port, function () {
    console.log(`App running on port ${config.server_port}`);
});