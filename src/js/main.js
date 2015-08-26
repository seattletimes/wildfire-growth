// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("jquery");
var moment = require("moment");

require("component-responsive-frame/child");
require("component-leaflet-map");

require("./loadData").then(function(data) {

  data.allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));

  var showSample = function(sample) {
    sample.layers.forEach(layer => layer.setStyle({ fillOpacity: .8 }));
  };

  var index = 0;

  var animate = function() {
    var delay = 500;

    index = (index + 1) % data.timestamps.length;
    if (index == 0) {
      data.allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));
    }
    if (index == data.timestamps.length - 1) {
      delay = 2000;
    }
    var time = data.timestamps[index];
    document.querySelector(".date").innerHTML = moment(time).format("MMM D, YYYY");
    showSample(data.samples[time]);
    setTimeout(animate, delay);
  };
  
   setTimeout(animate, 700);

});