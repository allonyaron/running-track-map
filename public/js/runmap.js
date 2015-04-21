
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
  
function initMapbox(venueLat, venueLng) {
  
  var fitBounds = false;

  if(venueLat && venueLng && venueLat !== '0' && venueLng !== '0') {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYWxsb255YXJvbiIsImEiOiJCRTBYUHBJIn0.p8AqSYVB7J57cXtoINr7tQ';
    var map = L.mapbox.map('map', 'allonyaron.lcghobge', {attributionControl: false});

    var myLayer = L.mapbox.featureLayer().addTo(map);
    var geoJson = {
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

      // Add markers
      $('.destMarker').each(function(index, element) {
        var markerLat = $(element).attr('data-lat');
        var markerLng = $(element).attr('data-lng');
        var markerName = $(element).attr('data-name');


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
              "marker-symbol": index+1
            }
          });
        }
      });

      myLayer.setGeoJSON(geoJson);
      map.scrollWheelZoom.disable();
      map.touchZoom.disable();

      if (fitBounds) {
        map.fitBounds(myLayer.getBounds());  
      }
    }
};    
    
$(document).ready(function() {    
    getLocation(); 
});