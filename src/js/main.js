// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var $ = require("jquery");

require("./loadData").then(function(data) {

  data.allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));

  var showSample = function(sample) {
    sample.layers.forEach(layer => layer.setStyle({ fillOpacity: .8 }));
  };

  var index = 0;

  var animate = function() {
    index = (index + 1) % data.timestamps.length;
    if (index == 0) {
      data.allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));
    }
    var time = data.timestamps[index];
    document.querySelector(".date").innerHTML = new Date(time);
    showSample(data.samples[time]);
    setTimeout(animate, 300);
  };
  
  animate();

});