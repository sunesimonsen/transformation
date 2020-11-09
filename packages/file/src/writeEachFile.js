const fs = require("fs").promises;
const { forEach } = require("@transformation/core");

const writeEachFile = (pathFunction, options) =>
  forEach(async (value) => {
    if (pathFunction) {
      const path = pathFunction(value);

      await fs.writeFile(path, value, options);
    } else {
      await fs.writeFile(value.path, value.data, value.options);
    }
  });

module.exports = writeEachFile;
