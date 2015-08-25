var colors = {
  "Wolverine": "#800026",
  "Okanogan Complex": "#bd0026",
  "Kettle North Complex": "#e31a1c",
  "Chelan Complex": "#fc4e2a",
  "North Star": "#fd8d3c"
};

module.exports = function(value) {
  return colors[value];
};
