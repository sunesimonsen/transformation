const { pipeline } = require("@transformation/core");
const { fromStream, pipe } = require("@transformation/stream");
const csvParser = require("csv-parser");
const fs = require("fs");

const readCSV = (path, options) =>
  pipeline(fromStream(fs.createReadStream(path)), pipe(csvParser(options)));

module.exports = readCSV;
