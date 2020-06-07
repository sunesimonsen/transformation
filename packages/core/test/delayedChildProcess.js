const { childProcess } = require("../src/process");
const map = require("../src/map");
const delay = require("../src/delay");

module.exports = childProcess(
  delay(5),
  map(n => n * n),
  delay(5)
);
