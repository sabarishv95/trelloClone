const express = require('express');
const app = express();
var path = require('path');
const mongoose=require('mongoose');
var bodyParser = require("body-parser");
var config = require('./config');

// connect database
mongoose.connect(config.db_host, { useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.on('connected',()=>{
    console.log('connected to mongodb');
});

mongoose.connection.on('error', (err) =>{
    if(err){
        console.log('error in connection is :'+ err)
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(config.server_port, function() {
    console.log(`App running on port ${config.server_port}`);
});