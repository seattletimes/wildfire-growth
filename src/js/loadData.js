var $ = require("jquery");

var deferred = $.Deferred();
var getColor = require("./palette");

var map = L.map('map', {
  scrollWheelZoom:false,
  attributionControl: false
  // doubleClickZoom: false,
  // touchZoom: false,
  // zoomControl:false,
  // dragging: false
}).setView([48.213, -119.932], 9);

L.control.attribution({position: 'bottomleft'}).addTo(map);

L.tileLayer("//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
  minZoom: 1,
  maxZoom: 19,
  subdomains: ["server", "services"],
  attribution: "<a href=\"https://static.arcgis.com/attribution/World_Topo_Map\">Esri</a>"
}).addTo(map);

var current = L.esri.featureLayer({
  url: "https://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Wildfire_Activity/MapServer/2",
  style: function (feature) {
    return { stroke: 0, fillColor: getColor(feature.properties.FIRE_NAME), weight: 2, fillOpacity: 0 };
  }
}).addTo(map);

var popupTemplate = '<div class="popuptext"><div class="bigheader">{name}</div><div>Acres burned: <span class="mediumheader">{acres}</span></div><div>'
;

current.bindPopup(function(feature){
 return L.Util.template(popupTemplate, {name: feature.properties.FIRE_NAME, acres: feature.properties.ACRES.toLocaleString()})
});

var request = $.ajax({
  url: "./assets/all-fires-new.geojson",
  dataType: "json"
});

// var currentRequest = $.ajax({
//   url: "",
//   dataType: "json"
// });

// $.when(request, currentRequest).then(function(data, currentData) {
  
// })

request.done(data => {
  var allLayers = [];
  var samples = {};

  data.features = data.features.map(function(feature) {
    var props = feature.properties;
    var dateSplit = props.date.split("/").map(Number);
    // var time = String(props.time || "0000");
    // var hours = time.slice(0, 2) * 1;
    // var minutes = time.slice(2) * 1;
    // var date = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], hours, minutes);
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
      layer.setStyle({ stroke: 0, fillColor: getColor(feature.properties.FIRE_NAME) });
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
    values,
    current,
    map
  });

});

module.exports = deferred.promise();
