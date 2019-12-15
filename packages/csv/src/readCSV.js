const { close, chan, put } = require("medium");
const csvParser = require("csv-parser");
const fs = require("fs");
const { Writable } = require("stream");

const readCSV = (path, options) => {
  const output = chan();

  fs.createReadStream(path)
    .pipe(csvParser(options))
    .pipe(
      new Writable({
        write: (data, encoding, callback) => {
          put(output, data).then(() => callback());
        },
        objectMode: true
      })
    )
    .on("finish", () => {
      close(output);
    });

  return output;
};

module.exports = readCSV;
