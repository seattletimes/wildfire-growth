var colors = {
  "Wolverine": "#fd8d3c",
  "Chelan Complex": "#fc4e2a",
  "Okanogan Complex": "#bd0026",
  "Kettle North Complex": "#e31a1c",
  "North Star": "#800026"
};

module.exports = function(value) {
  return colors[value];
};
