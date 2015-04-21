"use strict"
var express = require('express');
var exphbs  = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;  

var app = express();
var runningTracks = {};
var runningTrackArr = [];

app.engine('hbs', exphbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static('public'));

//get running track data 
MongoClient.connect('mongodb://localhost:27017/running', function(err, db) {
    
//db.runningtracks.find({geometry : {$near : {$geometry : { type : "Point" , coordinates : [-73.98267659999999, 40.6758102] }}}})
    
    if(err) throw err;
    db.collection('runningtracks').find().toArray(function(err, docs) {
        if(err) throw err;
            docs.forEach(function(doc) {
                     var track = {
                        name : doc.name,
                        lat : doc.geometry.coordinates[1],
                        lng : doc.geometry.coordinates[0]
                     };
                    runningTrackArr.push(track);
            });
            //console.log('runningTrackArr - ' + JSON.stringify(runningTrackArr));
        runningTracks.runningTrackArr = runningTrackArr;

        //db.close();
    });
});
 
app.get('/api/nearby/:lng/:lat',function(req,res) {
    MongoClient.connect('mongodb://localhost:27017/running', function(err, db) {
        if(err) console.log('connection error');
        db.collection('runningtracks').find({geometry : {$near : {$geometry : { type : "Point" , coordinates : [-73.98267659999999, 40.6758102] }}}}).toArray(function(err, docs) {
//        db.collection('runningtracks').findOne(function(err, docs) {
            if(err) throw err;
            res.send(docs);    
        })
    //db.close();
    });
    
});
 
app.get('/', function (req, res) {
    res.render('index', runningTracks);
});

app.listen(process.env.PORT);


