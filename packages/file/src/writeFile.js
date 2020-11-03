const fs = require("fs").promises;
const { forEach } = require("@transformation/core");

const writeFile = (path, options) => {
  return forEach(async value => {
    await fs.writeFile(path, value, options);
  });
};

module.exports = writeFile;
