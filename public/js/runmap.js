function initMapbox() {
  var venueLat = $('#destMap').attr('data-lat');
  var venueLng = $('#destMap').attr('data-lng');
  var markerName = $('#destMap').attr('data-name');
  var fitBounds = false;
  
  if(venueLat && venueLng && venueLat !== '0' && venueLng !== '0') {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYWxsb255YXJvbiIsImEiOiJCRTBYUHBJIn0.p8AqSYVB7J57cXtoINr7tQ';
    var map = L.mapbox.map('map', 'allonyaron.lcghobge', {attributionControl: false}).setView([venueLat, venueLng], 15);

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
            title: markerName,
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
              title: markerName,
              "marker-size": 'medium',
              "marker-color": '#00AEEF'
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
    initMapbox(); 
});