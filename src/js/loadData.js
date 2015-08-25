var $ = require("jquery");

var mapElement = document.querySelector("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;

var deferred = $.Deferred();
var getColor = require("./palette");

var request = $.ajax({
  url: "./assets/all-fires-time.geojson",
  dataType: "json"
});
request.done(data => {
  var allLayers = [];
  var samples = {};

  var geojson = L.geoJson(data, {
    onEachFeature(feature, layer) {
      var props = feature.properties;
      var dateSplit = props.date.split("/").map(Number);
      var time = String(props.time || "0000");
      var hours = time.slice(0, 2) * 1;
      var minutes = time.slice(2) * 1;
      var date = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], hours, minutes);
      var timestamp = date.getTime();
      if (!samples[timestamp]) samples[timestamp] = {
        date,
        timestamp,
        layers: [],
        area: 0
      };
      samples[timestamp].layers.push(layer);
      samples[timestamp].area += props.acres;
      allLayers.push(layer);
      layer.setStyle({ stroke: 0, fillColor: getColor(timestamp) });
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
