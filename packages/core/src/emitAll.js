const step = require("./step");

const emitAll = (...iterables) =>
  step(async ({ take, put, CLOSED }) => {
    for (const iterable of iterables) {
      for await (const item of iterable) {
        await put(item);
      }
    }
  });

module.exports = emitAll;
