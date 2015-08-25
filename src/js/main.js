// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");

var $ = require("jquery");
var moment = require("moment");

require("./loadData").then(function(data) {

  data.allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));

  var showSample = function(sample) {
    sample.layers.forEach(layer => layer.setStyle({ fillOpacity: .8 }));
  };

  var animating = true;
  var index = 0;

  var animate = function() {

    var delay = 500;

    if (!animating) return;

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

  document.querySelector(".animate").addEventListener("click", function() {
    document.querySelector(".animate").classList.add("selected");
    document.querySelector(".current").classList.remove("selected");
    data.current.setStyle({fillOpacity: 0});
    animating = true;
    index = 0;
    animate();
  });
  document.querySelector(".current").addEventListener("click", function() {
    document.querySelector(".animate").classList.remove("selected");
    document.querySelector(".current").classList.add("selected");
    data.current.setStyle({fillOpacity: 1});
    data.allLayers.forEach(layer => layer.setStyle({ fillOpacity: 0 }));
    animating = false;
    document.querySelector(".date").innerHTML = moment(Date.now()).format("MMM D, YYYY");
  });

});