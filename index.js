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
    
    if(err) throw err;
    db.collection('runningtracks').find({geometry : {$near : {$geometry : { type : "Point" , coordinates : [-73.98267659999999, 40.6758102] }}}}).toArray(function(err, docs) {
//    db.collection('runningtracks').find().toArray(function(err, docs) {
 
        if(err) throw err;
            docs.forEach(function(doc) {
                
                     var track = {
                        name : doc.name,
                        lat : doc.geometry.coordinates[1],
                        lng : doc.geometry.coordinates[0]
                     };
                //console.log(track);     
                    runningTrackArr.push(track);
            });
        runningTracks.runningTrackArr = runningTrackArr;
    });
});
 
app.get('/api/nearby/:lng/:lat',function(req,res) {
    
   // res.send(req.params.lng);
    
    MongoClient.connect('mongodb://localhost:27017/running', function(err, db) {
        if(err) console.log('connection error');
        var query = { geometry :{$near : {$geometry : { type : "Point" , coordinates : [parseFloat(req.params.lng) ,parseFloat(req.params.lat)] }}}};
        db.collection('runningtracks').find( query ).toArray(function(err, docs) {
            if(err) throw err;
            res.send(docs);    
        })
    //db.close();
    });
    
});
 
app.get('/', function (req, res) {
    res.render('index');
});

app.listen(process.env.PORT);


