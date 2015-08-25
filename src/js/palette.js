var colors = {
  24: "#FFD990",
  23: "#FCBB6D",
  21: "#F99E49",
  20: "#F47920",
  19: "#FA4C3C",
  18: "#E54E5F",
  17: "#A05DA5",
  16: "#522E91",
  15: "#260066"
};

module.exports = function(value) {
  var day = new Date(value).getDate();
  return colors[day];
};
