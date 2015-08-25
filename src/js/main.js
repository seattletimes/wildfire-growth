// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var $ = require("jquery");
var getColor = require("./palette");

require("./loadData").then(function(data) {

  var showSample = function(sample) {
    data.allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));
    sample.layers.forEach(layer => layer.setStyle({ fillOpacity: .8 }));
  };

  var animating = true;
  var index = 0;
  
  var animate = function() {
    if (!animating) return;
    index = (index + 1) % data.timestamps.length;
    var time = data.timestamps[index];
    showSample(data.samples[time]);
    setTimeout(animate, 400);
  };
  
  animate();

});