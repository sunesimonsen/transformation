const fs = require("fs");
const fromStream = require("./fromStream");

const fromFileStream = (path, options) =>
  fromStream(fs.createReadStream(path, options));

module.exports = fromFileStream;
