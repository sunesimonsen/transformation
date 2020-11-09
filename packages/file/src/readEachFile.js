const fs = require("fs").promises;
const { map } = require("@transformation/core");

const readEachFile = (options) =>
  map(async (path) => ({
    path,
    data: await fs.readFile(path, options),
  }));

module.exports = readEachFile;
