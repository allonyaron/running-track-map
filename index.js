"use strict"
var express = require('express');
var exphbs  = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;  
var app = express();
var runningTracks = {};

app.engine('hbs', exphbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

//get running track data 
MongoClient.connect('mongodb://localhost:27017/running', function(err, db) {
    if(err) throw err;
    db.collection('runningtracks').find().toArray(function(err, docs) {
        if(err) throw err;

        runningTracks = {
          runningTrackArr: docs
        };
        db.close();
    });
});
 
 
app.get('/', function (req, res) {
    res.render('index', runningTracks);
});

app.listen(process.env.PORT);


