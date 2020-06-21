const step = require("./step");

const emitAll = iterable =>
  step(async ({ take, put, CLOSED }) => {
    for await (let item of iterable) {
      await put(item);
    }
  });

module.exports = emitAll;
