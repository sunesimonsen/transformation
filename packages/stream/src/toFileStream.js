const fs = require("fs");
const toStream = require("./toStream");

const toFileStream = (path, options) =>
  toStream(fs.createWriteStream(path, options));

module.exports = toFileStream;
