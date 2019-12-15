const { createObjectCsvWriter } = require("csv-writer");
const { forEach, Group } = require("@transformation/core");

const getHeaders = value => {
  const firstItem = Group.isGroup(value) ? value.items[0] : value;

  return Object.keys(firstItem).map(id => ({ id, title: id }));
};

const writeCSV = (pathOrFunction, options = {}) => {
  const writers = {};
  return forEach(async value => {
    const path =
      typeof pathOrFunction === "function"
        ? pathOrFunction(value)
        : pathOrFunction;

    if (!writers[path]) {
      writers[path] = createObjectCsvWriter({
        ...options,
        path,
        header: options.header || getHeaders(value)
      });
    }

    await writers[path].writeRecords(
      Group.isGroup(value) ? value.items : [value]
    );
  });
};

module.exports = writeCSV;
