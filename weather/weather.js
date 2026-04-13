var map = L.map('map').setView([38, -95], 4);

// Different basemap than OpenStreetMap
var basemapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl, {
  attribution: 'Tiles © Esri'
}).addTo(map);

// Radar layer
var radarUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
var radarDisplayOptions = {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true
};

var radar = L.tileLayer.wms(radarUrl, radarDisplayOptions).addTo(map);

// Alerts layer
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';

$.getJSON(weatherAlertsUrl, function(data) {
  L.geoJSON(data, {
    style: function(feature) {
      var severity = feature.properties.severity;
      var alertColor = 'orange';

      if (severity === 'Severe') {
        alertColor = 'red';
      } else if (severity === 'Extreme') {
        alertColor = 'purple';
      } else if (severity === 'Minor') {
        alertColor = 'yellow';
      }

      return {
        color: alertColor,
        weight: 2,
        fillOpacity: 0.25
      };
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.headline);
    }
  }).addTo(map);
});
