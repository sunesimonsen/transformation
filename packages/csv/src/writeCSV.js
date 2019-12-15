const { createObjectCsvWriter } = require("csv-writer");
const { forEach } = require("@transformation/core");

const writeCSV = (path, options = {}) => {
  let writer;
  return forEach(async value => {
    if (!writer) {
      writer = createObjectCsvWriter({
        ...options,
        path: typeof path === "function" ? path(value) : path,
        header:
          options.header || Object.keys(value).map(id => ({ id, title: id }))
      });
    }

    await writer.writeRecords([value]);
  });
};

module.exports = writeCSV;
