var MongoClient = require('mongodb').MongoClient; 
var request = require("request");
var parseString = require('xml2js').parseString;

MongoClient.connect('mongodb://localhost:27017/running', function(err, db) {
    if(err) throw err;

    //get xml data
    request('http://www.nycgovparks.org/bigapps/DPR_RunningTracks_001.xml', function (error, response, body) {
            if(error) throw error;
            if (!error && response.statusCode == 200) {
                var runningTrackXML = body;
                parseString(runningTrackXML, {ignoreAttrs: true}, function (err, result) {
                    var runningTrackArray = result.runningtracks.facility;
                    
                    //insert data
                    db.collection('runningtracks').drop();
                    db.collection('runningtracks').insert(runningTrackArray, function (err, data) {
                            if(err) throw err;
                            console.log('records inserted');
                            db.close();
                    }); 
                });
                
            }
    });
});