const step = require("./step");

const map = (mapper, initialValue) =>
  step(async ({ take, put, CLOSED }) => {
    let lastResult = initialValue;
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      lastResult = await mapper(value, lastResult);
      await put(lastResult);
    }
  });

module.exports = map;
