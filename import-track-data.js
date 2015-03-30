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
                var geoTrackArray = [];
                var geoTrack = {};
                parseString(runningTrackXML, {ignoreAttrs: true}, function (err, result) {
                    var runningTrackArray = result.runningtracks.facility;
                    
                    //drop table
                    db.collection('runningtracks').drop();
                    //insert track data
                    runningTrackArray.forEach(function(elem) {
                        if(elem.lon[0] && elem.lat[0]) {
                            geoTrack = {
                                "name" : elem.Name[0],
                                "size" : elem.Size[0],
                                "location" : elem.Location[0],
                                "geometry" : {"type": "Point", 
                                              "coordinates": [parseFloat(elem.lon[0]), parseFloat(elem.lat[0])] }
                                
                                };
                           geoTrackArray.push(geoTrack);
                       //console.log('elem - ' + JSON.stringify(geoTrack)); 
                        };
                    });
                    db.collection('runningtracks').insert(geoTrackArray, function (err, data) {
                        if(err) throw err;
                        console.log('records inserted');
                        db.close();                           
                    });
                                                
                });
                                 
            }
            
    });
 
});