const step = require("./step");

const emitItems = (...items) =>
  step(async ({ take, put, CLOSED }) => {
    for (const item of items) {
      await put(item);
    }
  });

module.exports = emitItems;
