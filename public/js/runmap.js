


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess,  handle_error);
  } else {
    error('not supported');
  }
}
function geoSuccess(position){
  initMapbox(position.coords.latitude, position.coords.longitude);
}
  
function handle_error(err) {
  if (err.code == 1) {
    // user said no!
  }
}
  
function getTrackData(lat,lng, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/nearby/' + lng + '/' + lat);
  xhr.onreadystatechange = function() {
    if ((xhr.readyState===4) && (xhr.status===200)) {
      var tracks = JSON.parse(xhr.responseText);
      cb(tracks);
    }
  }
  xhr.send();
} 

function initMapbox(venueLat, venueLng) {
  var runningTracks;
  var markerLat, markerLng, markerName;
  var fitBounds = false;
  var geoJson = {};
  
  if(venueLat && venueLng && venueLat !== '0' && venueLng !== '0') {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYWxsb255YXJvbiIsImEiOiJCRTBYUHBJIn0.p8AqSYVB7J57cXtoINr7tQ';
    var map = L.mapbox.map('map', 'allonyaron.lcghobge', {attributionControl: false});

    var myLayer = L.mapbox.featureLayer().addTo(map);
    geoJson = {
      type : 'FeatureCollection',
      features : [{
          type : 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [venueLng, venueLat]
          },
          properties : {
            title: 'me',
            "marker-size": 'medium',
            "marker-color": '#fb351c'
          }
        }]
      };
      
      
        var count = 1;
        getTrackData(venueLat, venueLng, function(runningTracks) {
              for (var key in  runningTracks) {
                      markerLat = runningTracks[key].geometry.coordinates[1];
                      markerLng = runningTracks[key].geometry.coordinates[0];
                      markerName = runningTracks[key].name;
          
                  //nothing is safe
                  if(markerLat && markerLng && markerLat !== '0' && markerLng !== '0') {
                    fitBounds = true;
                    geoJson.features.push({
                      type : 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: [markerLng , markerLat]
                      },
                      properties : {
                        "title": markerName,
                        "marker-size": 'large',
                        "marker-color": '#00AEEF',
                        "marker-symbol": count
                      }
                    });
                    count++;
                  }
                };
                myLayer.setGeoJSON(geoJson);
                map.scrollWheelZoom.disable();
                map.touchZoom.disable();
          
                if (fitBounds) {
                  map.fitBounds(myLayer.getBounds());  
                }                

        });


    }
};    
    
$(document).ready(function() {    
    getLocation(); 
});