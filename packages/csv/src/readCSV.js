const { step } = require("@transformation/core");
const csvParser = require("csv-parser");
const fs = require("fs");
const { Writable } = require("stream");

const readCSV = (path, options) =>
  step(async ({ take, put }) => {
    await new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .on("error", reject)
        .pipe(csvParser(options))
        .on("error", reject)
        .pipe(
          new Writable({
            write: (data, encoding, callback) => {
              put(data).then(() => callback());
            },
            objectMode: true
          })
        )
        .on("error", reject)
        .on("finish", resolve);
    });
  });

module.exports = readCSV;
