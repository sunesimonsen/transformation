const fs = require("fs").promises;
const { forEach } = require("@transformation/core");

const writeFile = (path, options) =>
  forEach((value) => fs.writeFile(path, value, options));

module.exports = writeFile;
