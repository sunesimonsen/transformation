const { childProcess } = require("../src/process");
const { delay, map } = require("@transformation/core");

module.exports = childProcess(
  delay(5),
  map(n => n * n),
  delay(5)
);
