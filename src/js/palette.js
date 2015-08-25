var colors = {
  "Wolverine": "#fd8d3c",
  "Chelan Complex": "#fc4e2a",
  "Okanogan Complex": "#e31a1c",
  "Kettle North Complex": "#bd0026",
  "North Star": "#800026"
};

module.exports = function(value) {
  if (colors[value]) {
    return colors[value];
  } else {
    return "#feb24c";
  }
};
