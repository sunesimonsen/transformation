const { close, chan, put } = require("medium");
const csvParser = require("csv-parser");
const fs = require("fs");
const { Writable } = require("stream");

const readCSV = (path, options) => (input, errors) => {
  const output = chan();
  const errorHandler = err => {
    put(errors, err);
    close(output);
  };

  fs.createReadStream(path)
    .on("error", errorHandler)
    .pipe(csvParser(options))
    .on("error", errorHandler)
    .pipe(
      new Writable({
        write: (data, encoding, callback) => {
          put(output, data).then(() => callback());
        },
        objectMode: true
      })
    )
    .on("error", errorHandler)
    .on("finish", () => {
      close(output);
    });

  return output;
};

module.exports = readCSV;
