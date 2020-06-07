const { childProcess } = require("../src/process");
const map = require("../src/map");

module.exports = childProcess(
  map(n => {
    if (typeof n !== "number") {
      throw new TypeError(`Expected a number, got: ${n}`);
    }

    return n * n;
  })
);
