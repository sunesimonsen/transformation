const fs = require("fs").promises;
const { step } = require("@transformation/core");

const readFile = (...args) =>
  step(async ({ take, put, CLOSED }) => put(await fs.readFile(...args)));

module.exports = readFile;
