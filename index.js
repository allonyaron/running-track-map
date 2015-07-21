"use strict"
var express = require('express');
var exphbs  = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;  

var app = express();

app.engine('hbs', exphbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static('public'));

//get nearest running track api
app.get('/api/nearby/:lng/:lat',function(req,res) {
    
    MongoClient.connect('mongodb://localhost:27017/running', function(err, db) {
        if(err) console.log('connection error');
        var query = { geometry :{$near : {$geometry : { type : "Point" , coordinates : [parseFloat(req.params.lng) ,parseFloat(req.params.lat)] }}}};
        db.collection('runningtracks').find( query ).toArray(function(err, docs) {
            if(err) throw err;
            res.send(docs);    
        })
    });
});
 
app.get('/', function (req, res) {
    res.render('index');
});

app.listen(process.env.PORT);


