var $ = require("jquery");

var mapElement = document.querySelector("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;

var deferred = $.Deferred();
var getColor = require("./palette");

L.control.attribution({position: 'bottomleft'}).addTo(map);

var request = $.ajax({
  url: "./assets/all-fires-new.geojson",
  dataType: "json"
});

request.done(data => {
  var allLayers = [];
  var samples = {};

  data.features = data.features.map(function(feature) {
    var props = feature.properties;
    var dateSplit = props.date.split("/").map(Number);
    var date = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]);
    var timestamp = date.getTime();
    feature.properties.date = date;
    feature.properties.timestamp = timestamp;
    return feature;
  }).filter(f => f.properties.timestamp > new Date(2015, 6, 28));

  var geojson = L.geoJson(data, {
    onEachFeature(feature, layer) {
      var timestamp = feature.properties.timestamp;
      var date = feature.properties.date;
      if (!samples[timestamp]) samples[timestamp] = {
        date,
        timestamp,
        layers: [],
        area: 0
      };
      samples[timestamp].layers.push(layer);
      samples[timestamp].area += feature.properties.acres;
      allLayers.push(layer);
      layer.setStyle({ stroke: 0, fillColor: getColor(feature.properties.fire_name) });

      layer.bindPopup(`<div class="popuptext"><div class="bigheader">${feature.properties.fire_name}</div>`);
    }
  });

  var timestamps = Object.keys(samples).map(Number).sort();
  var values = timestamps.map(t => samples[t].area);

  geojson.addTo(map);
  map.fitBounds(geojson.getBounds());

  deferred.resolve({
    samples,
    allLayers,
    timestamps,
    values
  });

});

module.exports = deferred.promise();
