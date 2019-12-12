const { go, close, chan, put } = require("medium");
const csv = require("neat-csv");
const fs = require("fs");

const readCSV = (path, options) => {
  const output = chan();

  go(async () => {
    const rows = await csv(fs.createReadStream(path), options);

    for (let row of rows) {
      await put(output, row);
    }

    close(output);
  });

  return output;
};

module.exports = readCSV;
